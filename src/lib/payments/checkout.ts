import * as logger from '../utils/logger'
import Uuid from 'uuid/v4'
import { AccountingData, Product, Sale, Subscription } from './customer'
import nanoid from 'nanoid'
import { Emails } from './emails'
import { Services } from './services'
import { interpolate } from '../utils/utils'
const uuid = () => Uuid().toUpperCase()

export type CheckoutRequest = {
    email
    name
    address
    country
    isEU
    vatNumber
    currency
    amount
    vatRate
    price
    vatAmount
    nonce
    product: {
        name,
        code,
        permalink,
        isSubscription,
        isSupport
    }
}
// the mock less solution is likely to fire just some events from the checkout script
// like { action: 'sendEmail', data: { subject: '...' }}

export const checkout = (services: Services) => async (checkoutData: CheckoutRequest) => {
    logger.info('Processing checkout ' + JSON.stringify(checkoutData))
    const customer = await services.customerRepository.findOrCreate(checkoutData.email)

    let productBraintree: any = {}
    let subscription: Subscription = null

    if (checkoutData.product.isSubscription) {
        if (customer.braintree == null) {
            const customerRes = await services.braintree.createCustomer({
                company: checkoutData.name,
                email: checkoutData.email
            })

            if (customerRes.success === false) {
                throw new Error('Unable to create customer: ' + customerRes.message)
            }

            customer.braintree = { customerId: customerRes.customer.id }
        }

        const pmr = await services.braintree.createPaymentMethod({
            customerId: customer.braintree.customerId,
            paymentMethodNonce: checkoutData.nonce,
            options: {
                verifyCard: true
            }
        })

        if (pmr.success === false) {
            throw new Error('Unable to register payment method: ' + pmr.message)
        }

        const sr = await services.braintree.createSubscription({
            paymentMethodToken: pmr.paymentMethod.token,
            planId: checkoutData.product.code + (checkoutData.vatRate !== 0 ? 'VAT' : ''),
            merchantAccountId: 'jsreportsro'
        })

        if (sr.success === false) {
            throw new Error('Unable to create subscription ' + sr.message)
        }

        productBraintree.paymentMethod = pmr.paymentMethod
        productBraintree.subscription = sr.subscription
        subscription = { state: 'active', nextBillingDate: sr.subscription.nextBillingDate }
    } else {
        await services.braintree.createSale({
            amount: checkoutData.amount,
            paymentMethodNonce: checkoutData.nonce,
            options: {
                submitForSettlement: true
            }
        })
    }

    const accountingData: AccountingData = {
        address: checkoutData.address,
        amount: checkoutData.amount,
        country: checkoutData.country,
        currency: checkoutData.currency,
        isEU: checkoutData.isEU,
        name: checkoutData.name,
        price: checkoutData.price,
        vatAmount: checkoutData.vatAmount,
        vatNumber: checkoutData.vatNumber,
        vatRate: checkoutData.vatRate,
        item: checkoutData.product.name
    }

    const product: Product = {
        code: checkoutData.product.code,
        permalink: checkoutData.product.permalink,
        isSubscription: checkoutData.product.isSubscription,
        name: checkoutData.product.name,
        isSupport: checkoutData.product.isSupport,
        id: nanoid(4),
        sales: [],
        braintree: productBraintree,
        accountingData
    }

    if (!product.isSupport) {
        product.licenseKey = uuid()
    }

    if (subscription) {
        product.subscription = subscription
    }

    const sale = await services.customerRepository.createSale(accountingData)
    await services.renderInvoice(sale)
    product.sales.push(sale)

    await services.notifyLicensingServer(customer, product, product.sales[0])

    customer.products = customer.products || []
    customer.products.push(product)
    await services.customerRepository.update(customer)

    const mail = product.isSupport ? Emails.checkout.support : Emails.checkout.enterprise

    await services.sendEmail({
        to: customer.email,
        content: interpolate(mail.customer.content, { customer, product, sale: product.sales[0] }),
        subject: interpolate(mail.customer.subject, { customer, product, sale: product.sales[0] }),
    })

    await services.sendEmail({
        to: 'jan.blaha@jsreport.net',
        content: interpolate(mail.us.content, { customer, product }),
        subject: interpolate(mail.us.subject, { customer, product }),
    })

    return customer
}
