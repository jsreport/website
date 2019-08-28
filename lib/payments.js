
const logger = require('./logger.js')
const braintree = require('braintree')
const util = require('util')
const moment = require('moment')
const axios = require('axios')
const mailer = require('./mailer.js')
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
  const customer = await findOrCreateCustomer(paymentInfo.email, db)

  const nextId = await generateNextInvoiceId(db)
  const invoiceId = `${new Date().getFullYear()}-${nextId}B`

  paymentInfo.invoiceId = invoiceId
  paymentInfo.license_key = uuid()
  paymentInfo.purchaseDate = new Date()

  await gateway.transaction.sale({
    amount: paymentInfo.amount,
    paymentMethodNonce: paymentInfo.nonce,
    options: {
      submitForSettlement: true
    }
  })

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
    type: paymentInfo.product.name,
    licenseKey: paymentInfo.license_key,
    invoices: [{
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
    }]
  })
  await db.collection('customers').updateOne({ _id: customer._id }, { $set: { ...customer } })

  return customer
}

module.exports.customer = async (id, db) => {
  return db.collection('customers').findOne({ uuid: id })
}

module.exports.invoice = async (customerId, invoiceId, db) => {
  const customer = await db.collection('customers').findOne({ uuid: customerId })
  if (!customer) {
    throw new Error('Customer not found')
  }

  const invoice = customer.products.map(p => p.invoices).flat().find(i => i.data.invoiceId)
  if (!invoice) {
    throw new Error('Invoice not found')
  }

  return invoice.buffer.buffer
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
    uuid: uuid(),
    creationDate: new Date()
  }

  await db.collection('customers').insertOne(customer)

  return customer
}

async function generateNextInvoiceId (db) {
  await db.collection('invoiceCounter').updateOne({}, {
    $inc: {
      nextId: 1
    }
  })
  const counter = await db.collection('invoiceCounter').findOne({})
  return counter.nextId
}
