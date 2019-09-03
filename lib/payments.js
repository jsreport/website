const logger = require('./logger.js')
const braintree = require('braintree')
const util = require('util')
const moment = require('moment')
const axios = require('axios')
const mailer = require('./mailer.js')
const nanoid = require('nanoid')
const client = require('jsreport-client')(process.env.JO_URL, process.env.JO_USER, process.env.JO_PASSWORD)
const validateVat = util.promisify(require('validate-vat'))
const uuid = () => require('uuid/v4')().toUpperCase()

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

module.exports.generateToken = () => {
  return gateway.clientToken.generate({}).then(r => r.clientToken)
}

module.exports.validateVat = async (vatNumber = '') => {
  logger.debug('validating vat ' + vatNumber)
  const r = await validateVat(vatNumber.slice(0, 2), vatNumber.substring(2))

  if (r.valid !== true) {
    throw new Error('Invalid VAT')
  }

  return {
    country: r.countryCode,
    name: r.name,
    address: r.address
  }
}

module.exports.checkout = async (paymentInfo, db) => {
  logger.info('Processing checkout for ' + paymentInfo.email)
  const customer = await findOrCreateCustomer(paymentInfo.email, db)

  const nextId = await generateNextInvoiceId(db)
  const invoiceId = `${new Date().getFullYear()}-${nextId}B`

  paymentInfo.invoiceId = invoiceId
  paymentInfo.license_key = uuid()
  paymentInfo.purchaseDate = new Date()

  let productBraintree = {}
  let subscription = null

  if (paymentInfo.product.isSubscription) {
    if (customer.braintree == null) {
      const customerRes = await gateway.customer.create({
        company: paymentInfo.customer.name,
        email: paymentInfo.email
      })

      if (customerRes.success === false) {
        throw new Error('Unable to create customer: ' + customerRes.message)
      }

      customer.braintree = { customerId: customerRes.customer.id }
    }

    const pmr = await gateway.paymentMethod.create({
      customerId: customer.braintree.customerId,
      paymentMethodNonce: paymentInfo.nonce,
      options: {
        verifyCard: true
      }
    })

    if (pmr.success === false) {
      throw new Error('Unable to register payment method: ' + pmr.message)
    }

    const sr = await gateway.subscription.create({
      paymentMethodToken: pmr.paymentMethod.token,
      planId: paymentInfo.product.code,
      merchantAccountId: 'jsreportsro'
    })

    if (sr.success === false) {
      throw new Error('Unable to create subscription ' + sr.message)
    }

    productBraintree.subscriptionId = sr.subscription.id
    subscription = { state: 'active', nextBillingDate: sr.subscription.nextBillingDate }
  } else {
    await gateway.transaction.sale({
      amount: paymentInfo.amount,
      paymentMethodNonce: paymentInfo.nonce,
      options: {
        submitForSettlement: true
      }
    })
  }

  const renderResult = await client.render({
    template: {
      name: '/payments/invoice'
    },
    data: {
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
  })

  const buf = await renderResult.body()

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
    invoices: [
      {
        data: {
          invoiceId: paymentInfo.invoiceId,
          amount: paymentInfo.amount,
          vatAmount: paymentInfo.vatAmount,
          price: paymentInfo.price,
          vatRate: paymentInfo.vatRate,
          isEU: paymentInfo.isEU,
          currency: paymentInfo.currency
        },
        buffer: buf
      }
    ]
  })
  await db.collection('customers').updateOne({ _id: customer._id }, { $set: { ...customer } })

  return customer
}

module.exports.customer = async (id, db) => {
  logger.info('Loading customer ' + id)
  const res = await db.collection('customers').findOne({ uuid: id })
  if (!res) {
    throw new Error('Customer not found')
  }
  return res
}

module.exports.invoice = async (customerId, invoiceId, db) => {
  logger.info('Downloading invoice ' + invoiceId)
  const customer = await db.collection('customers').findOne({ uuid: customerId })
  if (!customer) {
    throw new Error('Customer not found')
  }

  const invoice = customer.products
    .map(p => p.invoices)
    .flat()
    .find(i => i.data.invoiceId === invoiceId)
  if (!invoice) {
    throw new Error('Invoice not found')
  }

  return invoice.buffer.buffer
}

module.exports.cancelSubscription = async (customerId, productId, db) => {
  logger.info('Canceling subscription customerId:' + customerId + ' productId:' + productId)

  const customer = await db.collection('customers').findOne({ uuid: customerId })
  if (!customer) {
    throw new Error('Customer not found')
  }

  const product = customer.products.find(p => p.id === productId)
  if (!product) {
    throw new Error('Product not found')
  }

  if (!product.isSubscription) {
    throw new Error('Cannot cancel product that is not subscription')
  }

  const cancelResult = await gateway.subscription.cancel(product.braintree.subscriptionId)

  if (cancelResult.success === false) {
    throw new Error('Unable to cancel subscription: ' + cancelResult.message)
  }

  product.subscription.state = 'canceled'
  await db.collection('customers').updateOne({ _id: customer._id }, { $set: customer })
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
  return counter.nextId
}
