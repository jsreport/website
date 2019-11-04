import { Product, AccountingData } from "../../src/lib/payments/customer"

export function createAccountingData(): AccountingData {
    return {
        address: 'address',
        country: 'cz',
        amount: 295,
        isEU: true,
        currency: 'USD',
        name: 'jsreport s.r.o.',
        price: 295,
        vatAmount: 0,
        vatRate: 0,
        vatNumber: 'CZ0102'
    }
}

export function createProduct(): Product {
    return {
        accountingData: createAccountingData(),
        braintree: { subscription: { id: 'braintreesubscriptionid' } },
        code: 'enterpriseSubscription',
        id: 'id',
        isSubscription: true,
        licenseKey: 'licensekey',
        name: 'jsreport enterprise subscription',
        permalink: 'permalink',
        subscription: {
            state: 'active',
            nextBillingDate: new Date()
        },
        sales: [{
            invoice: {
                buffer: Buffer.from('a'),
                data: {
                    accountingData: createAccountingData(),
                    id: 'id',
                    purchaseDate: new Date()
                }
            },
            purchaseDate: new Date()
        }]
    }
}