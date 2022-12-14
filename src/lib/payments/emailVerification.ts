import { Services } from './services'
import { interpolate } from '../utils/utils'
import emailProcessor from './emailProcessor'
import { Product } from './customer'

export const emailVerification = (services: Services) => async (email: string, product: Product) => {  
  const customer = await services.customerRepository.findOrCreate(email.toLocaleLowerCase())

  await emailProcessor(services.sendEmail, 'emailVerification', customer, {
    product
  })
}
