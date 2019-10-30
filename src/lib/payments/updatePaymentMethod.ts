import { CustomerRepository } from "./customer"
import Braintree from "./braintree"
import * as logger from '../utils/logger'

export default async function (customerId, productId, pm, {
    customerRepository,
    braintree
}: {
    customerRepository: CustomerRepository,
    braintree: Braintree
}) {
    logger.info(`updating patyment method for customer: ${customerId}, productId: ${productId}`)
    const customer = await customerRepository.find(customerId)
    const product = customer.products.find(p => p.id === productId)

    const pmr = await braintree.createPaymentMethod({
        customerId: customer.braintree.customerId,
        paymentMethodNonce: pm.nonce,
        options: {
            verifyCard: true
        }
    })

    if (pmr.success === false) {
        throw new Error('Unable to register payment method: ' + pmr.message)
    }

    const sres = await braintree.updateSubscription(product.braintree.subscription.id, {
        paymentMethodToken: pmr.paymentMethod.token
    })

    if (sres.success === false) {
        throw new Error('Unable to udpdate payment ' + sres.message)
    }

    product.braintree.paymentMethod = pmr.paymentMethod

    Object.assign(customer.products.find(p => p.id === productId), product)
    await customerRepository.update(customer)
}