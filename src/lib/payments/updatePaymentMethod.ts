import * as logger from '../utils/logger'
import { Services } from './services'

export const updatePaymentMethod = (services: Services) => async (customerId: string, productId: string, si) => {
  logger.info(`updating patyment method for customer: ${customerId}, productId: ${productId}`)
  const customer = await services.customerRepository.find(customerId)
  const product = customer.products.find((p) => p.id === productId)
  const stripeCustomer = await services.stripe.findOrCreateCustomer(customer.email)

  product.stripe.subscription = await services.stripe.updateSubscription(product.stripe.subscription.id, stripeCustomer.id, si.payment_method)

  Object.assign(
    customer.products.find((p) => p.id === productId),
    product
  )
  await services.customerRepository.update(customer)
}
