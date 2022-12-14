import { Services } from './services'
import emailProcessor from './emailProcessor'
import products from '../../shared/products'

export const cancelSubscription = (services: Services) => async (customerId, productId) => {
  const customer = await services.customerRepository.find(customerId)
  const product = customer.products.find((p) => p.id === productId)

  await emailProcessor(services.sendEmail, 'cancel',
    customer,
    {      
      product,
      productDefinition: products[product.code]
    })

  product.subscription.state = 'canceled'
  product.subscription.nextPayment = null
  product.subscription.retryPlannedPayment = null
  product.subscription.plannedCancelation = null

  Object.assign(
    customer.products.find((p) => p.id === productId),
    product
  )
  
  await services.customerRepository.update(customer)  

  if (product.webhook) {
    await services.notifyWebhook(customer, product, 'canceled')
  }  
}
