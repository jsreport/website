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
        vatNumber: 'CZ0102',
        item: 'jsreport enterprise subscription'
    }
}

export function createProduct(): Product {
    return {
        accountingData: createAccountingData(),
        braintree: { subscription: { id: 'braintreesubscriptionid', status: 'Active' }, paymentMethod: {} },
        code: 'enterpriseSubscription',
        id: 'id',
        isSupport: false,
        isSubscription: true,
        licenseKey: 'licensekey',
        name: 'jsreport enterprise subscription',
        permalink: 'permalink',
        sales: [{
            accountingData: createAccountingData(),
            id: 'id',
            blobName: 'id.pdf',
            purchaseDate: new Date()
        }]
    }
}