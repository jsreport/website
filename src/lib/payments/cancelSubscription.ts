import { Services } from './services'
import { Emails } from './emails'
import { interpolate } from '../utils/utils'

export const cancelSubscription = (services: Services) => async (customerId, productId) => {
  const customer = await services.customerRepository.find(customerId)
  const product = customer.products.find((p) => p.id === productId)
  product.subscription.state = 'canceled'
  product.subscription.nextPayment = null
  product.subscription.retryPlannedPayment = null
  product.subscription.plannedCancelation = null

  Object.assign(
    customer.products.find((p) => p.id === productId),
    product
  )
  await services.customerRepository.update(customer)

  const mail = product.licenseKey ? Emails.cancel.enterprise : Emails.cancel.custom

  if (product.webhook) {
    await services.notifyWebhook(customer, product, 'canceled')
  }

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
