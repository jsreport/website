import * as logger from '../utils/logger'
import Uuid from 'uuid/v4'
import { AccountingData, Product, Invoice, Subscription } from './customer'
import nanoid from 'nanoid'
import { Services } from './services'

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
        isSubscription
    }
}

const uuid = () => Uuid().toUpperCase()

// the mock less solution is likely to fire just some events from the checkout script
// like { action: 'sendEmail', data: { subject: '...' }}

export const checkout = (services: Services) => async (checkoutData: CheckoutRequest) => {
    logger.info('Processing checkout for ' + checkoutData.email)
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
        vatRate: checkoutData.vatRate
    }

    const product: Product = {
        licenseKey: uuid(),
        code: checkoutData.product.code,
        permalink: checkoutData.product.permalink,
        isSubscription: checkoutData.product.isSubscription,
        name: checkoutData.product.name,
        id: nanoid(4),
        sales: [],
        braintree: services.braintree,
        accountingData
    }

    if (subscription) {
        product.subscription = subscription
    }

    const invoiceData = await services.customerRepository.createInvoiceData(accountingData)
    const invoice: Invoice = {
        buffer: await services.render(invoiceData),
        data: invoiceData
    }

    product.sales.push({
        invoice,
        purchaseDate: new Date()
    })

    await services.notifyLicensingServer(customer, product, product.sales[0])

    customer.products = customer.products || []
    customer.products.push(product)
    await services.customerRepository.update(customer)

    await services.sendEmail({
        to: customer.email,
        content: 'Your license key is ' + product.licenseKey,
        subject: 'jsreport epterprise license'
    })

    return customer
}
