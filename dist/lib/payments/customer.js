"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = __importDefault(require("nanoid"));
class CustomerRepository {
    constructor(db) {
        this.db = db;
    }
    async find(customerId) {
        const customer = await this.db
            .collection('customers')
            .findOne({ uuid: customerId });
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }
    async findByEmail(email) {
        const customer = await this.db.collection('customers').findOne({ email });
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }
    async findOrCreate(email) {
        let customer = await this.db.collection('customers').findOne({ email });
        if (customer) {
            return customer;
        }
        customer = {
            email,
            uuid: nanoid_1.default(16),
            creationDate: new Date()
        };
        await this.db.collection('customers').insertOne(customer);
        return customer;
    }
    async update(customer) {
        return this.db
            .collection('customers')
            .updateOne({ _id: customer._id }, { $set: { ...customer } });
    }
    async findSale(customerId, saleId) {
        const customer = await this.find(customerId);
        const sale = Array.prototype
            .concat(...customer.products.map(p => p.sales))
            .find(s => s.id === saleId);
        if (!sale) {
            throw new Error(`Invoice ${saleId} not found`);
        }
        return sale;
    }
    async findBySubscription(subscriptionId) {
        const customer = await this.db.collection('customers').findOne({
            products: {
                $elemMatch: { 'braintree.subscription.id': subscriptionId }
            }
        });
        return customer;
    }
    async createSale(data, transaction) {
        await this.db.collection('invoiceCounter').updateOne({}, {
            $inc: {
                nextId: 1
            }
        }, {
            upsert: true
        });
        let counter = await this.db.collection('invoiceCounter').findOne({});
        const id = `${new Date().getFullYear()}-${counter.nextId}B`;
        const sale = {
            accountingData: data,
            id: id,
            blobName: `${id}.pdf`,
            purchaseDate: new Date(),
            braintree: {
                transaction
            }
        };
        return sale;
    }
}
exports.CustomerRepository = CustomerRepository;
//# sourceMappingURL=customer.js.map