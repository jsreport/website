import * as logger from '../utils/logger'
import { Services } from "./services"

export const updatePaymentMethod = (services: Services) => async (customerId: string, productId: string, nonce: string) => {
    logger.info(`updating patyment method for customer: ${customerId}, productId: ${productId}`)
    const customer = await services.customerRepository.find(customerId)
    const product = customer.products.find(p => p.id === productId)

    const pmr = await services.braintree.createPaymentMethod({
        customerId: customer.braintree.customerId,
        paymentMethodNonce: nonce,
        options: {
            verifyCard: true
        }
    })

    if (pmr.success === false) {
        throw new Error('Unable to register payment method: ' + pmr.message)
    }

    const sres = await services.braintree.updateSubscription(product.braintree.subscription.id, {
        paymentMethodToken: pmr.paymentMethod.token,
        id: product.braintree.subscription.id,
        merchantAccountId: null,
        planId: null
    })

    if (sres.success === false) {
        throw new Error('Unable to udpdate payment ' + sres.message)
    }

    product.braintree.paymentMethod = pmr.paymentMethod

    Object.assign(customer.products.find(p => p.id === productId), product)
    await services.customerRepository.update(customer)
}