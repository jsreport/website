import databaseTest from './databaseTest'
import { updatePaymentMethod } from '../../src/lib/payments/updatePaymentMethod'
import { CustomerRepository } from '../../src/lib/payments/customer'
import 'should'
import { Db } from 'mongodb'
import { createProduct } from './helpers'
import { PaymentMethodCreateRequest, SubscriptionRequest } from 'braintree'

databaseTest((getDb) => {
    describe('updatePaymentMethod', () => {
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
            braintree.createPaymentMethod = (obj: PaymentMethodCreateRequest) => {
                obj.customerId.should.be.eql(customer.braintree.customerId)
                obj.paymentMethodNonce.should.be.eql('nonce')

                return {
                    success: true,
                    paymentMethod: {
                        token: 'token'
                    }
                }
            }

            braintree.updateSubscription = (id, update: SubscriptionRequest) => {
                id.should.be.eql(customer.products[0].braintree.subscription.id)
                update.paymentMethodToken.should.be.eql('token')
                return {
                    success: true
                }
            }

            await updatePaymentMethod({
                customerRepository,
                braintree
            })(customer.uuid, customer.products[0].id, 'nonce')

            const updatedCustomer = await customerRepository.find(customer.uuid)
            updatedCustomer.products[0].braintree.paymentMethod.token.should.be.eql('token')
        })
    })
})
