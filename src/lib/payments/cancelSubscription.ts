import { Services } from './services'
import { Emails } from './emails'
import { interpolate } from '../utils/utils'

export const cancelSubscription = (services: Services) => async (customerId, productId) => {
  const customer = await services.customerRepository.find(customerId)
  const product = customer.products.find((p) => p.id === productId)
  product.subscription.state = 'canceled'
  // await services.stripe.cancelSubscription(product.stripe.subscription.id)

  // product.stripe.subscription.status = 'canceled'

  Object.assign(
    customer.products.find((p) => p.id === productId),
    product
  )
  await services.customerRepository.update(customer)

  const mail = product.isSupport ? Emails.cancel.support : Emails.cancel.enterprise

  await services.sendEmail({
    to: customer.email,
    content: interpolate(mail.customer.content, { customer, product }),
    subject: interpolate(mail.customer.subject, { customer, product }),
  })

  await services.sendEmail({
    to: 'jan.blaha@jsreport.net',
    content: interpolate(mail.us.content, { customer, product }),
    subject: interpolate(mail.us.subject, { customer, product }),
  })
}
