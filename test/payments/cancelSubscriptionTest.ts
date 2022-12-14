import databaseTest from './databaseTest'
import { cancelSubscription } from '../../src/lib/payments/cancelSubscription'
import { CustomerRepository } from '../../src/lib/payments/customer'
import should from 'should'
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

    it('should update subscription and send emails', async () => {
      const customer = await customerRepository.findOrCreate('a@a.com')
      const product = createProduct()
      product.subscription.nextPayment = new Date()
      product.subscription.plannedCancelation = new Date()
      product.subscription.retryPlannedPayment = new Date()
      customer.products = [product]

      await customerRepository.update(customer)
      const emails: Array<Email> = []

      await cancelSubscription({
        customerRepository,
        sendEmail: async (m) => emails.push(m),
      })(customer.uuid, customer.products[0].id)

      const updatedCustomer = await customerRepository.find(customer.uuid)
      updatedCustomer.products[0].subscription.state.should.be.eql('canceled')
      should(updatedCustomer.products[0].subscription.nextPayment).be.null()
      should(updatedCustomer.products[0].subscription.plannedCancelation).be.null()
      should(updatedCustomer.products[0].subscription.retryPlannedPayment).be.null()

      emails[0].to.should.be.eql(customer.email)      
      emails[0].content.should.containEql('canceled')
    })
  })
})
