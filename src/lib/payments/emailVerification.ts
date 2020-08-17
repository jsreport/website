import { Services } from './services'
import { interpolate } from '../utils/utils'
import { Emails } from './emails'

export const emailVerification = (services: Services) => async (email: string, productCode) => {
  const stripeCustomer = await services.stripe.findOrCreateCustomer(email.toLowerCase())
  const customer = await services.customerRepository.findOrCreate(email.toLocaleLowerCase(), stripeCustomer.id)

  await services.sendEmail({
    to: customer.email,
    content: interpolate(Emails.emailVerification.content, { customer, productCode }),
    subject: interpolate(Emails.emailVerification.subject, { customer, productCode }),
  })
}
