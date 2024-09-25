import * as logger from '../utils/logger'
import Uuid from 'uuid/v4'
import { AccountingData, Product, Subscription } from './customer'
import nanoid from 'nanoid'
import { Services } from './services'
import moment from 'moment'
import Stripe from 'stripe'
import products from '../../shared/products'
import emailProcessor from './emailProcessor'
import { processUpgrade } from './processUpgrade'

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

  const productDefinition = products[checkoutData.productCode]  
  
  let subscription: Subscription
  if (productDefinition.isSubscription) {
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
      paymentCycle: checkoutData.paymentCycle
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
    item: productDefinition.name,
    email: customer.email
  }
  
  let product: Product = {
    code: productDefinition.code,
    permalink: productDefinition.permalink,
    isSubscription: productDefinition.isSubscription,
    name: productDefinition.name,
    isSupport: productDefinition.isSupport,
    id: nanoid(4),
    sales: [],
    accountingData,
    licenseKey: (productDefinition.hasLicenseKey === false) ? null : uuid(),
    subscription,    
    webhook: productDefinition.webhook,
    planCode: checkoutData.planCode
  }

  const sale = await services.customerRepository.createSale(accountingData, {
    paymentIntentId: stripePaymentIntent.id,
  })

  await services.renderInvoice(sale)
  product.sales.push(sale)

  await services.notifyLicensingServer(customer, product, product.sales[0])

  if (productDefinition.isUpgrade) {
    await processUpgrade(services)(customer, product, sale);
  } 
  

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

  await emailProcessor(services.sendEmail, `checkout${product.licenseKey ? '-license' : ''}`, customer, {
    sale: product.sales[product.sales.length - 1],
    product,
    productDefinition
  }) 
  
  if (productDefinition.webhook) {
    await services.notifyWebhook(customer, product, 'checkouted')
  }
  
  return product
}
