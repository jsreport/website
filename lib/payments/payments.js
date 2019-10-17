require('./types.js')

const logger = require('../utils/logger')
const util = require('util')
const moment = require('moment')
const axios = require('axios')
const mailer = require('../utils/mailer.js')
const nanoid = require('nanoid')
const client = require('jsreport-client')(process.env.JO_URL, process.env.JO_USER, process.env.JO_PASSWORD)
const validateVatUtil = util.promisify(require('validate-vat'))
const uuid = () => require('uuid/v4')().toUpperCase()

module.exports = (braintree, db) => ({
  generateToken () {
    return braintree.generateToken()
  },

  async validateVat (vatNumber = '') {
    logger.debug('validating vat ' + vatNumber)
    const r = await validateVatUtil(vatNumber.slice(0, 2), vatNumber.substring(2))

    if (r.valid !== true) {
      throw new Error('Invalid VAT')
    }

    return {
      country: r.countryCode,
      name: r.name,
      address: r.address
    }
  },

  async checkout (paymentInfo) {
    logger.info('Processing checkout for ' + paymentInfo.email)
    const customer = await findOrCreateCustomer(paymentInfo.email, db)

    paymentInfo.invoiceId = await generateNextInvoiceId(db)
    paymentInfo.license_key = uuid()
    paymentInfo.purchaseDate = new Date()

    let productBraintree = {}
    let subscription = null

    if (paymentInfo.product.isSubscription) {
      if (customer.braintree == null) {
        const customerRes = await braintree.createCustomer({
          company: paymentInfo.customer.name,
          email: paymentInfo.email
        })

        if (customerRes.success === false) {
          throw new Error('Unable to create customer: ' + customerRes.message)
        }

        customer.braintree = { customerId: customerRes.customer.id }
      }

      const pmr = await braintree.createPaymentMethod({
        customerId: customer.braintree.customerId,
        paymentMethodNonce: paymentInfo.nonce,
        options: {
          verifyCard: true
        }
      })

      if (pmr.success === false) {
        throw new Error('Unable to register payment method: ' + pmr.message)
      }

      const sr = await braintree.createSubscription({
        paymentMethodToken: pmr.paymentMethod.token,
        planId: paymentInfo.product.code + (paymentInfo.vatRate !== 0 ? 'VAT' : ''),
        merchantAccountId: 'jsreportsro'
      })

      if (sr.success === false) {
        throw new Error('Unable to create subscription ' + sr.message)
      }

      productBraintree.paymentMethod = pmr.paymentMethod
      productBraintree.subscription = sr.subscription
      subscription = { state: 'active', nextBillingDate: sr.subscription.nextBillingDate }
    } else {
      await braintree.createSale({
        amount: paymentInfo.amount,
        paymentMethodNonce: paymentInfo.nonce,
        options: {
          submitForSettlement: true
        }
      })
    }

    const invoiceData = {
      invoiceId: paymentInfo.invoiceId,
      customer: paymentInfo.customer,
      purchaseDate: moment().format('DD.MM YYYY'),
      amount: paymentInfo.amount,
      vatAmount: paymentInfo.vatAmount,
      price: paymentInfo.price,
      item: paymentInfo.product.name,
      vatRate: paymentInfo.vatRate,
      isEU: paymentInfo.isEU,
      currency: paymentInfo.currency
    }
    const buf = await renderInvoice(invoiceData)

    /* mailer({
      to: paymentInfo.email,
      content: 'Your license key is ' + paymentInfo.license_key,
      subject: 'jsreport epterprise license'
    }) */

    // await notifyGumroadHook(paymentInfo)

    customer.products = customer.products || []
    customer.products.push({
      purchaseDate: paymentInfo.purchaseDate,
      code: paymentInfo.product.code,
      licenseKey: paymentInfo.license_key,
      isSubscription: paymentInfo.product.isSubscription,
      id: nanoid(4),
      subscription,
      braintree: productBraintree,
      name: paymentInfo.product.name,
      permalink: paymentInfo.product.permalink,
      invoices: [
        {
          data: invoiceData,
          buffer: buf
        }
      ]
    })
    await db.collection('customers').updateOne({ _id: customer._id }, { $set: { ...customer } })

    return customer
  },

  async updatePaymentMethod (customerId, productId, pm) {
    logger.info(`updating patyment method for customer: ${customerId}, productId: ${productId}`)
    const customer = await findCustomer(customerId, db)
    const product = customer.products.find(p => p.id === productId)

    const pmr = await braintree.createPaymentMethod({
      customerId: customer.braintree.customerId,
      paymentMethodNonce: pm.nonce,
      options: {
        verifyCard: true
      }
    })

    if (pmr.success === false) {
      throw new Error('Unable to register payment method: ' + pmr.message)
    }

    const sres = await braintree.updateSubscription(product.braintree.subscription.id, {
      paymentMethodToken: pmr.paymentMethod.token
    })

    if (sres.success === false) {
      throw new Error('Unable to udpdate payment ' + sres.message)
    }

    product.braintree.paymentMethod = pmr.paymentMethod

    Object.assign(customer.products.find(p => p.id === productId), product)
    await db.collection('customers').updateOne({ uuid: customerId }, { $set: customer })
  },

  async customer (id) {
    logger.info('Loading customer ' + id)
    const res = await db.collection('customers').findOne({ uuid: id })
    if (!res) {
      throw new Error('Customer not found')
    }
    return res
  },

  async invoice (customerId, invoiceId) {
    logger.info('Downloading invoice ' + invoiceId)
    const customer = await findCustomer(customerId, db)

    const invoice = customer.products
      .map(p => p.invoices)
      .flat()
      .find(i => i.data.invoiceId === invoiceId)
    if (!invoice) {
      throw new Error('Invoice not found')
    }

    return invoice.buffer.buffer
  },

  async cancelSubscription (customerId, productId) {
    logger.info('Canceling subscription customerId:' + customerId + ' productId:' + productId)

    const customer = await findCustomer(customerId)
    const product = customer.products.find(p => p.id === productId)

    const cancelResult = await braintree.cancelSubscription(product.braintree.subscription.id)

    if (cancelResult.success === false) {
      throw new Error('Unable to cancel subscription: ' + cancelResult.message)
    }

    product.subscription.state = 'canceled'
    Object.assign(customer.products.find(p => p.id === productId), product)
    await db.collection('customers').updateOne({ _id: customer._id }, { $set: customer })
  },

  async braintreeHook (signature, body) {
    logger.info('Parsing braintree hook')

    const webhookNotification = await braintree.parseWebHook(signature, body)
    logger.info('processing braintree hook of kind ' + webhookNotification.kind)

    try {
      switch (webhookNotification.kind) {
        case 'subscription_charged_successfully':
          return processSubscriptionChargeNotif(webhookNotification.subscription, db)
        case 'subscription_charged_unsuccessfully':
          return processSubscriptionFailedChargeNotif(webhookNotification.subscription.db)
        default:
          logger.info('skip processing ' + webhookNotification.kind)
      }
    } catch (e) {
      logger.error('Critical error when processing braintree hook', e)
      throw e
    }
  }
})

/*
const path = require('path')
  const signature = decodeURIComponent(
    require('fs')
      .readFileSync(path.join(__dirname, 'signature.txt'))
      .toString()
  )
  const body = decodeURIComponent(
    require('fs')
      .readFileSync(path.join(__dirname, 'body.txt'))
      .toString()
  )
  gateway.webhookNotification.parse(signature, body, function (err, webhookNotification) {
    console.log('[Webhook Received ' + webhookNotification.timestamp + '] | Kind: ' + webhookNotification.kind)

    // Example values for webhook notification properties
    console.log(webhookNotification.kind) // "subscriptionWentPastDue"
    console.log(webhookNotification.timestamp) // Sun Jan 1 00:00:00 UTC 2012
  })
  */

async function processSubscriptionChargeNotif (payload) {
  logger.info('Search for customer with subscription id ' + payload.subscription.id)
  const customer = await db.collection('customer').findOne({ products: { $elemMatch: { 'braintree.subscription.id': payload.subscription.id } } })

  if (!customer) {
    throw Error('Unable to find customer with subscription')
  }

  const product = customer.products.find(p => p.braintree.subscription.id === payload.subscription.id)
  product.subscription.nextBillingDate = payload.subscription.nextBillingDate

  const invoiceData = { ...product.invoices[product.invoices.length - 1].data }
  invoiceData.invoiceId = await generateNextInvoiceId(db)
  invoiceData.purchaseDate = moment().format('DD.MM YYYY')
  invoiceData.buffer = await renderInvoice(invoiceData)
  product.invoices.push(invoiceData)
  product.braintree.subscription = payload.subscription

  await db.collection('customer').update({ _id: customer._id }, { $set: customer })

  /*
    email: paymentInfo.email,
    purchaseDate: paymentInfo.purchaseDate,
    customer: paymentInfo.customer,
    price: paymentInfo.amount,
    currency: paymentInfo.currency,
    invoiceId: paymentInfo.invoiceId,
    license_key: paymentInfo.license_key,
    braintree: true,
    product_name: paymentInfo.product.name,
    permalink: paymentInfo.product.permalink
    */

  /*
  await notifyGumroadHook({
    email: customer.email,
    purchaseDate: new Date(),
    braintree: true,
    license_key: product.licenseKey,
    product_name: product.name,
    permalink: product.permalink,
    ...invoiceData
  })
  */
}

async function processSubscriptionFailedChargeNotif (subscription) {}

async function findSubscription (subscription) {}

async function renderInvoice (data) {
  const renderResult = await client.render({
    template: {
      name: '/payments/invoice'
    },
    data
  })

  return renderResult.body()
}

async function notifyGumroadHook (paymentInfo) {
  return axios.post('https://jsreportonline.net/gumroad-hook', {
    email: paymentInfo.email,
    purchaseDate: paymentInfo.purchaseDate,
    customer: paymentInfo.customer,
    price: paymentInfo.amount,
    currency: paymentInfo.currency,
    invoiceId: paymentInfo.invoiceId,
    license_key: paymentInfo.license_key,
    braintree: true,
    product_name: paymentInfo.product.name,
    permalink: paymentInfo.product.permalink
  })
}

/**
 * @param {string} customerId
 * @param {*} db
 * @returns {Promise<Customer>}
 */
async function findCustomer (customerId, db) {
  const customer = await db.collection('customers').findOne({ uuid: customerId })
  if (!customer) {
    throw new Error('Customer not found')
  }

  return customer
}

async function findOrCreateCustomer (email, db) {
  let customer = await db.collection('customers').findOne({ email })

  if (customer) {
    return customer
  }

  customer = {
    email,
    uuid: nanoid(16),
    creationDate: new Date()
  }

  await db.collection('customers').insertOne(customer)

  return customer
}

async function generateNextInvoiceId (db) {
  await db.collection('invoiceCounter').updateOne(
    {},
    {
      $inc: {
        nextId: 1
      }
    }
  )
  const counter = await db.collection('invoiceCounter').findOne({})
  return `${new Date().getFullYear()}-${counter.nextId}B`
}
