import * as logger from '../utils/logger'
import Uuid from 'uuid/v4'
import moment from 'moment'
import { CustomerRepository, Sale, AccountingData, Product } from './customer'
import nanoid from 'nanoid'
import Braintree from './braintree'

export type Checkout = {
    email
    name
    address
    country
    isEU
    vatNumber
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

export default async function (checkoutData: Checkout, {
    customerRepository,
    invoiceCounter,
    braintree,
    renderInvoice,
    notifyGumroad
}: {
    customerRepository: CustomerRepository,
    invoiceCounter: () => Promise<string>,
    braintree: Braintree,
    renderInvoice: (o: object) => Promise<[]>,
    notifyGumroad: (o: object) => Promise<void>
}) {
    logger.info('Processing checkout for ' + checkoutData.email)
    const customer = await customerRepository.findOrCreate(checkoutData.email)

    let productBraintree: any = {}
    let subscription = null

    if (checkoutData.product.isSubscription) {
        if (customer.braintree == null) {
            const customerRes = await braintree.createCustomer({
                company: checkoutData.name,
                email: checkoutData.email
            })

            if (customerRes.success === false) {
                throw new Error('Unable to create customer: ' + customerRes.message)
            }

            customer.braintree = { customerId: customerRes.customer.id }
        }

        const pmr = await braintree.createPaymentMethod({
            customerId: customer.braintree.customerId,
            paymentMethodNonce: checkoutData.nonce,
            options: {
                verifyCard: true
            }
        })

        if (pmr.success === false) {
            throw new Error('Unable to register payment method: ' + pmr.message)
        }

        const sr = await braintree.createSubscription({
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
        await braintree.createSale({
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
        currency: checkoutData.country,
        isEU: checkoutData.isEU,
        name: checkoutData.name,
        price: checkoutData.price,
        vatAmount: checkoutData.vatAmount,
        vatNumber: checkoutData.vatAmount,
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
        braintree,
        accountingData
    }

    const invoiceId = await invoiceCounter()

    const buf = await renderInvoice({
        ...accountingData,
        product: {
            ...product
        }
    })

    /* mailer({
    to: paymentInfo.email,
    content: 'Your license key is ' + paymentInfo.license_key,
    subject: 'jsreport epterprise license'
  }) */

    // await notifyGumroadHook(paymentInfo)

    if (subscription) {
        product.subscription = subscription
    }

    product.sales.push({
        invoice: {
            data: {
                accountingData: accountingData,
                id: invoiceId
            },
            buffer: buf
        },
        purchaseDate: new Date()
    })

    customer.products = customer.products || []
    customer.products.push(product)
    await customerRepository.update(customer)

    return customer
}