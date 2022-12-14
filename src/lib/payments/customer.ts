import { Db } from 'mongodb'
import nanoid from 'nanoid'
import moment from 'moment'

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
  item: string,
  currencyRate?: number,
  isExpense?: boolean,
  countryCode?: string,
  email: string
}

export type Sale = {
  purchaseDate: Date
  accountingData: Partial<AccountingData>
  id: string
  blobName: string
  stripe?: SaleStripe
}

export type SaleStripe = {
  paymentIntentId: string
}

export type Card = {
  last4: string
  expMonth: number
  expYear: number
}

export type SubscriptionStripe = {
  paymentMethodId: string
}

export type Subscription = {
  state: 'active' | 'canceled'
  nextPayment: Date
  retryPlannedPayment?: Date
  plannedCancelation?: Date
  card: Card
  stripe: SubscriptionStripe,
  paymentCycle?: string
}

export type Product = {
  id: string
  licenseKey?: string
  isSubscription: boolean
  isSupport: boolean
  code: string
  permalink?: string
  name: string
  sales: Array<Sale>
  accountingData: AccountingData
  subscription: Subscription,
  webhook?: string,  
  planCode?: string
}

export type Customer = {
  _id: string
  email: string
  uuid: string
  creationDate: Date
  products: Array<Product>
}

export class CustomerRepository {
  db: Db

  constructor(db: Db) {
    this.db = db
  }

  async find(customerId) {
    const customer = await this.db.collection('customers').findOne({ uuid: customerId })
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
      creationDate: new Date(),
    }

    await this.db.collection('customers').insertOne(customer)

    return <Customer>customer
  }

  async update(customer: Customer) {
    return this.db.collection('customers').updateOne({ _id: customer._id }, { $set: { ...customer } })
  }

  async findSale(customerId, saleId): Promise<Sale> {
    const customer = await this.find(customerId)

    const sale = Array.prototype.concat(...customer.products.map((p) => p.sales)).find((s) => s.id === saleId)

    if (!sale) {
      throw new Error(`Invoice ${saleId} not found`)
    }

    return sale
  }

  async createSale(data: AccountingData, saleStripe: SaleStripe) {
    await this.db.collection('invoiceCounter').updateOne(
      {},
      {
        $inc: {
          nextId: 1,
        },
      },
      {
        upsert: true,
      }
    )

    let counter = await this.db.collection('invoiceCounter').findOne({})

    const id = `${new Date().getFullYear()}-${counter.nextId}B`
    const sale: Sale = {
      accountingData: data,
      id: id,
      blobName: `${id}.pdf`,
      purchaseDate: new Date(),
      stripe: saleStripe,
    }

    return sale
  }

  async findCustomersWithPastDueSubscriptions() {    
    return this.db
      .collection('customers')
      .find({
        products: {
          $elemMatch: {
            'subscription.nextPayment': {
              $lt: new Date(),
            },
            'subscription.state': {
              $ne: 'canceled',
            },
          },
        },
      })
      .toArray()
  }

  async findCustomersWithInvoicesLastMonth() {
    const startOfMonth = moment().add(-1, 'M').startOf('month').toDate()
    const endOfMonth   = moment().add(-1, 'M').endOf('month').toDate()

    return this.db
      .collection('customers')
      .find({
        'products.sales': {
          $elemMatch: {
            purchaseDate: {
              $lt: endOfMonth,
              $gt: startOfMonth
            }
          },
        },
      })
      .toArray()
  }
}
