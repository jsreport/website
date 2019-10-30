import * as logger from '../utils/logger'
import Braintree from "./braintree"
import moment from 'moment'
import { CustomerRepository, InvoiceData } from './customer'


export default function ({
    customerRepository,
    braintree,
    invoiceCounter,
    renderInvoice
}: {
    customerRepository: CustomerRepository
    braintree: Braintree
    invoiceCounter: () => Promise<string>,
    renderInvoice: (data: object) => Promise<[]>
}) {
    async function processSubscriptionChargeNotif(payload) {
        logger.info('Search for customer with subscription id ' + payload.subscription.id)
        const customer = await customerRepository.findBySubscription(payload.subscription.id)

        if (!customer) {
            throw Error('Unable to find customer with subscription')
        }

        const product = customer.products.find(p => p.braintree.subscription.id === payload.subscription.id)
        product.subscription.nextBillingDate = payload.subscription.nextBillingDate

        const lastSale = { ...product.sales[product.sales.length - 1] }
        lastSale.invoice.data.id = await invoiceCounter()
        lastSale.purchaseDate = new Date()
        invoiceData.buffer = await renderInvoice(invoiceData)
        product.invoices.push(invoiceData)
        product.braintree.subscription = payload.subscription

        await customerRepository.update(customer)

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
        const webhookNotification = await braintree.parseWebHook(signature, body)
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