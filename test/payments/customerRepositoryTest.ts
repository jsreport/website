import databaseTest from './databaseTest'
import { CustomerRepository } from '../../src/lib/payments/customer'
import 'should'
import { Db } from 'mongodb'
import { createProduct } from './helpers'

databaseTest((getDb) => {
    describe('customer repository', () => {
        let db: Db
        let customerRepository: CustomerRepository

        beforeEach(() => {
            db = getDb()
            customerRepository = new CustomerRepository(db)
        })

        it('findSale', async () => {
            const customer = await customerRepository.findOrCreate('a@a.com')
            const product = createProduct()
            customer.products = [product]
            await customerRepository.update(customer)
            const sale = await customerRepository.findSale(customer.uuid, product.sales[0].id)
            sale.should.be.ok()
        })

        it('create sale', async () => {
            const sale = await customerRepository.createSale(createProduct().accountingData, { id: 'tranid' })
            sale.id.should.be.eql(`${new Date().getFullYear()}-1B`)
            sale.braintree.transaction.id.should.be.eql('tranid')

            const sale2 = await customerRepository.createSale(createProduct().accountingData, {})
            sale2.id.should.be.eql(`${new Date().getFullYear()}-2B`)

            const count = await db.collection('invoiceCounter').countDocuments({})
            count.should.be.eql(1)
        })
    })
})
