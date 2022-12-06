import * as logger from '../utils/logger'
import Uuid from 'uuid/v4'
import { AccountingData, Product, Subscription } from './customer'
import nanoid from 'nanoid'
import { Emails } from './emails'
import { Services } from './services'
import { interpolate } from '../utils/utils'
import moment from 'moment'
import Stripe from 'stripe'
import products from '../../shared/products'

const uuid = () => Uuid().toUpperCase()

export type CheckoutRequest = {
  customerId
  name
  address
  country
  isEU
  vatNumber
  currency
  amount
  vatRate
  price
  vatAmount
  paymentIntentId
  productCode,
  planCode,
  paymentCycle
}

export const checkout = (services: Services) => async (checkoutData: CheckoutRequest) => {
  logger.info('Processing checkout ' + JSON.stringify(checkoutData))

  const customer = await services.customerRepository.find(checkoutData.customerId)

  const stripePaymentIntent = await services.stripe.findPaymentIntent(checkoutData.paymentIntentId)
  const stripePaymentMethod: Stripe.PaymentMethod = <Stripe.PaymentMethod>stripePaymentIntent.payment_method

  const productFromCheckout = products[checkoutData.productCode]  

  let subscription: Subscription
  if (productFromCheckout.isSubscription) {
    subscription = {
      state: 'active',
      nextPayment: checkoutData.paymentCycle === 'monthly' ? moment().add(1, 'months').toDate() : moment().add(1, 'years').toDate(),
      card: {
        last4: stripePaymentMethod.card.last4,
        expMonth: stripePaymentMethod.card.exp_month,
        expYear: stripePaymentMethod.card.exp_year,
      },
      stripe: {
        paymentMethodId: (<any>stripePaymentIntent.payment_method).id,
      },
    }
  }

  const accountingData: AccountingData = {
    address: checkoutData.address,
    amount: checkoutData.amount,
    country: checkoutData.country,
    currency: checkoutData.currency,
    isEU: checkoutData.isEU,
    name: checkoutData.name,
    price: checkoutData.price,
    vatAmount: checkoutData.vatAmount,
    vatNumber: checkoutData.vatNumber,
    vatRate: checkoutData.vatRate,
    item: productFromCheckout.name,
    email: customer.email
  }
  
  let product: Product = {
    code: productFromCheckout.code,
    permalink: productFromCheckout.permalink,
    isSubscription: productFromCheckout.isSubscription,
    name: productFromCheckout.name,
    isSupport: productFromCheckout.isSupport,
    id: nanoid(4),
    sales: [],
    accountingData,
    licenseKey: (productFromCheckout.hasLicenseKey === false) ? null : uuid(),
    subscription,
    paymentCycle: checkoutData.paymentCycle,    
    webhook: productFromCheckout.webhook,
    planCode: checkoutData.planCode
  }

  const sale = await services.customerRepository.createSale(accountingData, {
    paymentIntentId: stripePaymentIntent.id,
  })

  await services.renderInvoice(sale)
  product.sales.push(sale)

  await services.notifyLicensingServer(customer, product, product.sales[0])

  customer.products = customer.products || []
  if (product.planCode) {
    const existingProduct = customer.products.find(p => p.code == product.code)
    if (existingProduct) {      
      existingProduct.planCode = product.planCode
      existingProduct.sales.push(sale)
      existingProduct.accountingData = accountingData      
      existingProduct.subscription = product.subscription      
      product = existingProduct
    } else {
      customer.products.push(product)
    }
  } else {
    customer.products.push(product)
  } 
  
  await services.customerRepository.update(customer)
  
  const mail = Emails.checkout[productFromCheckout.emailType]

  await services.sendEmail({
    to: customer.email,
    content: interpolate(mail.customer.content, {
      customer,
      product,
      sale: product.sales[0],
    }),
    subject: interpolate(mail.customer.subject, {
      customer,
      product,
      sale: product.sales[0],
    }),
  })

  await services.sendEmail({
    to: 'jan.blaha@jsreport.net',
    content: interpolate(mail.us.content, { customer, product }),
    subject: interpolate(mail.us.subject, { customer, product }),
  })
  
  if (productFromCheckout.webhook) {
    await services.notifyWebhook(customer, product, 'checkouted')
  }
  
  return product
}
