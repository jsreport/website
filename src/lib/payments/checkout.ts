import * as logger from '../utils/logger'
import Uuid from 'uuid/v4'
import { AccountingData, Product, Subscription } from './customer'
import nanoid from 'nanoid'
import { Emails } from './emails'
import { Services } from './services'
import { interpolate } from '../utils/utils'
import moment from 'moment'
import Stripe from 'stripe'

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
  product: {
    name
    code
    permalink
    isSubscription
    isSupport
  }
}

export const checkout = (services: Services) => async (checkoutData: CheckoutRequest) => {
  logger.info('Processing checkout ' + JSON.stringify(checkoutData))

  const customer = await services.customerRepository.find(checkoutData.customerId)

  const stripePaymentIntent = await services.stripe.findPaymentIntent(checkoutData.paymentIntentId)
  const stripePaymentMethod: Stripe.PaymentMethod = <Stripe.PaymentMethod>stripePaymentIntent.payment_method

  let subscription: Subscription
  if (checkoutData.product.isSubscription) {
    subscription = {
      state: 'active',
      nextPayment: moment().add(1, 'years').toDate(),
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
    item: checkoutData.product.name,
    email: customer.email
  }

  const product: Product = {
    code: checkoutData.product.code,
    permalink: checkoutData.product.permalink,
    isSubscription: checkoutData.product.isSubscription,
    name: checkoutData.product.name,
    isSupport: checkoutData.product.isSupport,
    id: nanoid(4),
    sales: [],
    accountingData,
    licenseKey: checkoutData.product.isSupport ? null : uuid(),
    subscription,
  }

  const sale = await services.customerRepository.createSale(accountingData, {
    paymentIntentId: stripePaymentIntent.id,
  })

  await services.renderInvoice(sale)
  product.sales.push(sale)

  await services.notifyLicensingServer(customer, product, product.sales[0])

  customer.products = customer.products || []
  customer.products.push(product)
  await services.customerRepository.update(customer)

  const mail = product.isSupport ? Emails.checkout.support : (product.code === 'enterpriseUpgrade' ? Emails.checkout.upgrade : Emails.checkout.enterprise)

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

  return customer
}
