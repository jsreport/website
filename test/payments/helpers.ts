import { Product, AccountingData } from '../../src/lib/payments/customer'
import moment from 'moment'

export function createAccountingData(): AccountingData {
  return {
    email: 'test@test.com',
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
    item: 'jsreport enterprise subscription',
  }
}

export function createProduct(): Product {
  return {
    accountingData: createAccountingData(),
    code: 'enterpriseSubscription',
    id: 'id',
    isSupport: false,
    isSubscription: true,
    licenseKey: 'licensekey',
    name: 'jsreport enterprise subscription',
    permalink: 'permalink',
    sales: [
      {
        accountingData: createAccountingData(),
        id: 'id',
        blobName: 'id.pdf',
        purchaseDate: new Date(),
      },
    ],
    subscription: {
      state: 'active',
      nextPayment: moment().add(1, 'years').toDate(),
      card: {
        expMonth: 1,
        expYear: 1,
        last4: '4567',
      },
      stripe: {
        paymentMethodId: 'id',
      },
    },
  }
}