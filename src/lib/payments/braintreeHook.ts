import * as logger from '../utils/logger'
import { Services } from './services'
import { Invoice } from './customer'


export default function (services: Services) {
    async function processSubscriptionChargeNotif(payload) {
        logger.info('Search for customer with subscription id ' + payload.subscription.id)
        const customer = await services.customerRepository.findBySubscription(payload.subscription.id)

        if (!customer) {
            throw Error('Unable to find customer with subscription')
        }

        const product = customer.products.find(p => p.braintree.subscription.id === payload.subscription.id)
        product.subscription.nextBillingDate = payload.subscription.nextBillingDate
        product.braintree.subscription = payload.subscription

        const invoiceData = await services.customerRepository.createInvoiceData(product.accountingData)
        const invoice: Invoice = {
            buffer: await services.render(invoiceData),
            data: invoiceData
        }

        product.sales.push({
            invoice,
            purchaseDate: new Date()
        })

        await services.customerRepository.update(customer)

        /*
        email: paymentInfo.email,
        purchaseDate: paymentInfo.purchaseDate,
        customer: paymentInfo.customer,
        price: paymentInfo.amount,
        currency: paymentInfo.currency,
        invoiceId: paymentInfo.invoiceId,
        license_key: paymentInfo.license_key,
        braintree: true,
        product_name: paymentInfo.product.name,
        permalink: paymentInfo.product.permalink
        */

        /*
      await notifyGumroadHook({
        email: customer.email,
        purchaseDate: new Date(),
        braintree: true,
        license_key: product.licenseKey,
        product_name: product.name,
        permalink: product.permalink,
        ...invoiceData
      })
      */
    }

    async function processSubscriptionFailedChargeNotif(subscription) { }

    return async function (signature, body) {
        const webhookNotification = await services.braintree.parseWebHook(signature, body)
        logger.info('processing braintree hook of kind ' + webhookNotification.kind)

        try {
            switch (webhookNotification.kind) {
                case 'subscription_charged_successfully':
                    return processSubscriptionChargeNotif(webhookNotification.subscription)
                case 'subscription_charged_unsuccessfully':
                    return processSubscriptionFailedChargeNotif(webhookNotification.subscription)
                default:
                    logger.info('skip processing ' + webhookNotification.kind)
            }
        } catch (e) {
            logger.error('Critical error when processing braintree hook', e)
            throw e
        }
    }
}