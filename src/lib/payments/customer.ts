import { Db } from 'mongodb'
import nanoid from 'nanoid'
import { Transaction } from 'braintree'

export type AccountingData = {
  name: string
  address: string
  country: string
  vatNumber: string
  isEU: boolean
  vatRate: number
  currency: string
  price: number
  amount: number
  vatAmount: number
  item: string
}

export type Sale = {
  purchaseDate: Date
  accountingData: AccountingData
  id: string
  blobName: string
  braintree?: SaleBraintree
}

export type SaleBraintree = {
  transaction: Transaction
}

export type SubscriptionBraintree = {
  status: string
  id: string
  merchantAccountId?: string
  planId?: string
}

export type ProductBraintree = {
  subscription: SubscriptionBraintree
  paymentMethod: any
}

export type Product = {
  id: string
  licenseKey?: string
  isSubscription: boolean
  isSupport: boolean
  code: string
  permalink: string
  name: string
  sales: Array<Sale>
  braintree: ProductBraintree
  accountingData: AccountingData
}

export type Customer = {
  _id: string
  email: string
  uuid: string
  creationDate: Date
  products: Array<Product>
  braintree: any
}

export class CustomerRepository {
  db: Db

  constructor(db: Db) {
    this.db = db
  }

  async find(customerId) {
    const customer = await this.db
      .collection('customers')
      .findOne({ uuid: customerId })
    if (!customer) {
      throw new Error('Customer not found')
    }

    return <Customer>customer
  }

  async findByEmail(email: string) {
    const customer = await this.db.collection('customers').findOne({ email })
    if (!customer) {
      throw new Error('Customer not found')
    }

    return <Customer>customer
  }

  async findOrCreate(email) {
    let customer = await this.db.collection('customers').findOne({ email })

    if (customer) {
      return <Customer>customer
    }

    customer = {
      email,
      uuid: nanoid(16),
      creationDate: new Date()
    }

    await this.db.collection('customers').insertOne(customer)

    return <Customer>customer
  }

  async update(customer: Customer) {
    return this.db
      .collection('customers')
      .updateOne({ _id: customer._id }, { $set: { ...customer } })
  }

  async findSale(customerId, saleId): Promise<Sale> {
    const customer = await this.find(customerId)

    const sale = Array.prototype
      .concat(...customer.products.map(p => p.sales))
      .find(s => s.id === saleId)

    if (!sale) {
      throw new Error(`Invoice ${saleId} not found`)
    }

    return sale
  }

  async findBySubscription(subscriptionId) {
    const customer = await this.db.collection('customers').findOne({
      products: {
        $elemMatch: { 'braintree.subscription.id': subscriptionId }
      }
    })
    return <Customer>customer
  }

  async createSale(data: AccountingData, transaction) {
    await this.db.collection('invoiceCounter').updateOne(
      {},
      {
        $inc: {
          nextId: 1
        }
      },
      {
        upsert: true
      }
    )

    let counter = await this.db.collection('invoiceCounter').findOne({})

    const id = `${new Date().getFullYear()}-${counter.nextId}B`
    const sale: Sale = {
      accountingData: data,
      id: id,
      blobName: `${id}.pdf`,
      purchaseDate: new Date(),
      braintree: {
        transaction
      }
    }

    return sale
  }
}
