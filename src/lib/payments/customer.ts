import { Db } from 'mongodb'
import nanoid from 'nanoid'

export type AccountingData = {
    name: string,
    address: string,
    country: string,
    vatNumber: string,
    isEU: boolean,
    vatRate: number,
    currency: string,
    price: number,
    amount: number,
    vatAmount: number
}

export type InvoiceData = {
    id: string,
    accountingData: AccountingData
}

export type Invoice = {
    data: InvoiceData
    buffer: []
}

export type Sale = {
    purchaseDate: Date
    invoice: Invoice
}

export type Product = {
    id: string
    licenseKey: string
    isSubscription: boolean
    code: string
    permalink: string
    name: string
    sales: Array<Sale>
    braintree: any
    subscription?: any
    accountingData: AccountingData
}

export type Customer = {
    _id: string
    email: string
    uuid: string
    creationDate: Date
    products: Array<Product>,
    braintree: any
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
        return this.db.collection('customers').updateOne({ _id: customer._id }, { $set: { ...customer } })
    }

    async invoice(customerId, invoiceId) {
        const customer = await this.find(customerId)

        const invoice = Array.prototype.concat(...customer.products.map(p => p.sales)).find(s => s.invoice.id === invoiceId)

        if (!invoice) {
            throw new Error('Invoice not found')
        }

        return invoice.buffer.buffer
    }

    async findBySubscription(subscriptionId) {
        const customer = await this.db.collection('customer').findOne({ products: { $elemMatch: { 'braintree.subscription.id': subscriptionId } } })
        return <Customer>customer
    }
}
