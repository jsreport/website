import databaseTest from './databaseTest'
import { updatePaymentMethod } from '../../src/lib/payments/updatePaymentMethod'
import { CustomerRepository } from '../../src/lib/payments/customer'
import should from 'should'
import { Db } from 'mongodb'
import { createProduct } from './helpers'
import { Email } from '../../src/lib/utils/mailer'

databaseTest((getDb) => {
  describe('update payment method', () => {
    let db: Db
    let customerRepository: CustomerRepository
    let successfullyPaymentProcessing
    let stripe: any = {}

    beforeEach(() => {
      stripe = {}
      db = getDb()
      customerRepository = new CustomerRepository(db)
      successfullyPaymentProcessing = []
    })

    it('should process subscription renew when passed payment intent and update the payment method', async () => {
      let customer = await customerRepository.findOrCreate('a@a.com')
      const product = createProduct()
      customer.products = [product]
      await customerRepository.update(customer)

      stripe.findPaymentIntent = async (id) => ({
        id,
        payment_method: {
          id: 'paymentMethodId',
          card: {
            last4: 'UPDA',
            expMonth: 1,
            expYear: 25,
          },
        },
      })

      await updatePaymentMethod({ customerRepository, stripe }, async (customer, product, paymentIntent) => {
        successfullyPaymentProcessing.push({
          customer,
          product,
          paymentIntent,
        })
      })(customer.uuid, product.id, { paymentIntentId: 'paymentIntentId' })

      successfullyPaymentProcessing[0].customer.uuid.should.be.eql(customer.uuid)      
      successfullyPaymentProcessing[0].product.subscription.card.last4.should.be.eql('UPDA')
      successfullyPaymentProcessing[0].product.subscription.stripe.paymentMethodId.should.be.eql('paymentMethodId')
    })

    it('should update payment method when a setup intent is passed', async () => {
      let customer = await customerRepository.findOrCreate('a@a.com')
      const product = createProduct()
      customer.products = [product]
      await customerRepository.update(customer)

      stripe.findSetupIntent = async (id) => ({
        id,
        payment_method: {
          id: 'paymentMethodId',
          card: {
            last4: 'UPDA',
            expMonth: 1,
            expYear: 25,
          },
        },
      })

      await updatePaymentMethod({ customerRepository, stripe }, async (customer, product, paymentIntent) => {
        successfullyPaymentProcessing.push({
          customer,
          product,
          paymentIntent,
        })
      })(customer.uuid, product.id, { setupIntentId: 'setupIntentId' })

      customer = await customerRepository.findOrCreate('a@a.com')
      customer.products[0].subscription.card.last4.should.be.eql('UPDA')
      customer.products[0].subscription.stripe.paymentMethodId.should.be.eql('paymentMethodId')
    })
  })
})
