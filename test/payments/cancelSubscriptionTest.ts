import databaseTest from './databaseTest'
import { cancelSubscription } from '../../src/lib/payments/cancelSubscription'
import { CustomerRepository } from '../../src/lib/payments/customer'
import 'should'
import { Db } from 'mongodb'
import { createProduct } from './helpers'
import { Email } from '../../src/lib/utils/mailer'

databaseTest((getDb) => {
    describe('cancelSubscription', () => {
        let db: Db
        let customerRepository: CustomerRepository

        beforeEach(() => {
            db = getDb()
            customerRepository = new CustomerRepository(db)
        })

        it('call braintree and update customer', async () => {
            const customer = await customerRepository.findOrCreate('a@a.com')
            customer.products = [createProduct()]
            customer.braintree = {
                customerId: 'braintreecustomerid'
            }
            await customerRepository.update(customer)

            const braintree = <any>{}
            braintree.cancelSubscription = (subscriptionId) => {
                subscriptionId.should.be.eql(customer.products[0].braintree.subscription.id)
            }

            const emails: Array<Email> = []
            await cancelSubscription({
                customerRepository,
                braintree,
                sendEmail: async (m) => emails.push(m)
            })(customer.uuid, customer.products[0].id)

            const updatedCustomer = await customerRepository.find(customer.uuid)
            updatedCustomer.products[0].subscription.state.should.be.eql('canceled')

            emails[0].to.should.be.eql(customer.email)
            emails[0].content.should.containEql('canceled')
        })
    })
})
