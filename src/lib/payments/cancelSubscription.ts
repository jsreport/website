import { CustomerRepository } from "./customer"
import Braintree from "./braintree"
import { Services } from "./services"

export const cancelSubscription = (services: Services) => async (customerId, productId) => {
    const customer = await services.customerRepository.find(customerId)
    const product = customer.products.find(p => p.id === productId)

    await services.braintree.cancelSubscription(product.braintree.subscription.id)

    product.subscription.state = 'canceled'
    Object.assign(customer.products.find(p => p.id === productId), product)
    await services.customerRepository.update(customer)
}