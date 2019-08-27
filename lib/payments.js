
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

module.exports.validateVat = (vatNumber = '') => {
  return validateVat(vatNumber.slice(0, 2), vatNumber.substring(2))
}

module.exports.checkout = async (paymentInfo, db) => {
  const customer = await findOrCreateCustomer(paymentInfo, db)

  const nextId = await generateNextInvoiceId(db)
  const invoiceId = `${new Date().getFullYear()}-${nextId}B`

  paymentInfo.invoiceId = invoiceId
  paymentInfo.license_key = uuid()
  paymentInfo.purchaseDate = new Date()

  await gateway.transaction.sale({
    amount: paymentInfo.amountToPay,
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

async function findOrCreateCustomer (customerOpts, db) {
  let customer = await db.collection('customers').findOne({ email: customerOpts.email })

  if (customer) {
    return customer
  }

  customer = {
    email: customerOpts.email,
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

/*
var a =
{
  _id: ObjectId('5d2f29f51d35d30026c0344c'),
  seller_id: 'os4KmcJsLUmBqkbcgOltXg==',
  product_id: 'rVBxQ16ElhL49ftdn3mTeQ==',
  product_name: ' jsreport enterprise subscription',
  permalink: 'SBwu',
  product_permalink: 'https://gum.co/SBwu',
  email: 'finance@cig.nl',
  price: '29500',
  currency: 'usd',
  quantity: '1',
  order_number: '941558243',
  sale_id: 'fymVmL2DeUZY1V13vyJIxQ==',
  sale_timestamp: '2019-07-17T14:00:17Z',
  full_name: 'Rob van den Bosch',
  purchaser_id: '5183763615419',
  subscription_id: '8-pchD7j84Re9HnytILp_Q==',
  is_recurring_charge: 'true',
  license_key: '740E40D4-10714686-B3D1DE37-4B91C5D7',
  recurrence: 'yearly',
  is_gift_receiver_purchase: 'false',
  refunded: 'false',
  resource_name: 'sale',
  disputed: 'false',
  dispute_won: 'false',
  purchaseDate: ISODate('2019-07-17T14:00:21.719Z')
}
*/
