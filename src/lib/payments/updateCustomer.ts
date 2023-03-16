import * as logger from '../utils/logger'

export const updateCustomer = (customerRepository) => async (uuid, update) => {
  logger.info(`Updating customer ${uuid}`)
  try {
    const customer = await customerRepository.find(uuid)
    if (!customer.originalEmail && update.email && customer.email !== update.email) {
      update.originalEmail = customer.email
    }
    Object.assign(customer, update)

    return customerRepository.update(customer)
  } catch (e) {
    logger.error('Updating customer failed', e)
    throw e
  }
}
