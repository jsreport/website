import { CustomerRepository } from "./customer"
import Braintree from "./braintree"

export default async function (customerId, productId, {
    customerRepository,
    braintree
}: {
    customerRepository: CustomerRepository,
    braintree: Braintree
}) {
    const customer = await customerRepository.find(customerId)
    const product = customer.products.find(p => p.id === productId)

    await braintree.cancelSubscription(product.braintree.subscription.id)

    product.subscription.state = 'canceled'
    Object.assign(customer.products.find(p => p.id === productId), product)
    await customerRepository.update(customer)
}