import * as logger from '../utils/logger'
import { Services } from './services'
import Stripe from 'stripe'
import { Customer, Product } from './customer'

type SetupIntentOrPaymentIntent = {
  setupIntentId?: string
  paymentIntentId?: string
}

export const updatePaymentMethod = (
  services: Services,
  processSuccessfullPayment: (customer: Customer, product: Product, paymentIntent: Stripe.PaymentIntent) => Promise<any>
) => async (customerId: string, productId: string, data: SetupIntentOrPaymentIntent) => {
  const customer = await services.customerRepository.find(customerId)
  const product = customer.products.find((p) => p.id === productId)

  if (data.setupIntentId) {
    logger.info(`updating payment method for customer: ${customer.email}`)
    const stripeSetupIntent = await services.stripe.findSetupIntent(data.setupIntentId)
    const stripePaymentMethod = <Stripe.PaymentMethod>stripeSetupIntent.payment_method

    product.subscription.card = {
      last4: stripePaymentMethod.card.last4,
      expMonth: stripePaymentMethod.card.exp_month,
      expYear: stripePaymentMethod.card.exp_year,
    }

    product.subscription.stripe.paymentMethodId = stripePaymentMethod.id
    await services.customerRepository.update(customer)
    logger.info(`updating payment method for customer: ${customer.email} successfull`)
  } else {
    logger.info(`updating payment method for customer: ${customer.email} as immediate charge confirmation`)
    const stripePaymentIntent = await services.stripe.findPaymentIntent(data.paymentIntentId)
    const stripePaymentMethod = <Stripe.PaymentMethod>stripePaymentIntent.payment_method

    product.subscription.card = {
      last4: stripePaymentMethod.card.last4,
      expMonth: stripePaymentMethod.card.exp_month,
      expYear: stripePaymentMethod.card.exp_year,
    }

    return processSuccessfullPayment(customer, product, stripePaymentIntent)
  }
}
