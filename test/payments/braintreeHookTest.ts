import databaseTest from './databaseTest'
import { braintreeHook } from '../../src/lib/payments/braintreeHook'
import { CustomerRepository } from '../../src/lib/payments/customer'
import 'should'
import { Db } from 'mongodb'
import { createProduct } from './helpers'
import { Email } from '../../src/lib/utils/mailer'

databaseTest((getDb) => {
    describe('braintree hook', () => {
        let db: Db
        let customerRepository: CustomerRepository

        beforeEach(() => {
            db = getDb()
            customerRepository = new CustomerRepository(db)
        })

        it('on successfull charge ', async () => {
            const customer = await customerRepository.findOrCreate('a@a.com')
            customer.products = [createProduct()]
            await customerRepository.update(customer)

            const braintree = <any>{}
            braintree.parseWebHook = (signature, body) => {
                body.should.be.eql('body')
                signature.should.be.eql('signature')
                return {
                    kind: 'subscription_charged_successfully',
                    subscription: {
                        id: customer.products[0].braintree.subscription.id
                    }
                }
            }
            const emails: Array<Email> = []
            await braintreeHook({
                customerRepository,
                braintree,
                notifyLicensingServer: async (c, p, s) => {
                    c.email.should.be.eql(customer.email)
                },
                sendEmail: async (m) => emails.push(m),
                renderInvoice: async () => { }
            })('signature', 'body')

            const updatedCustomer = await customerRepository.find(customer.uuid)
            const product = updatedCustomer.products[0]
            product.sales.should.have.length(2)
            const sale = product.sales[1]
            sale.accountingData.address.should.be.eql(customer.products[0].accountingData.address)

            emails[0].to.should.be.eql(customer.email)
            emails[0].content.should.containEql(`https://jsreport.net/payments/customer/${customer.uuid}`)
            emails[0].content.should.containEql('successfuly renewed')
        })

        it('on failed charge ', async () => {
            const customer = await customerRepository.findOrCreate('a@a.com')
            customer.products = [createProduct()]
            await customerRepository.update(customer)

            const braintree = <any>{}
            braintree.parseWebHook = (signature, body) => {
                body.should.be.eql('body')
                signature.should.be.eql('signature')
                return {
                    kind: 'subscription_charged_unsuccessfully',
                    subscription: {
                        id: customer.products[0].braintree.subscription.id
                    }
                }
            }
            const emails: Array<Email> = []
            await braintreeHook({
                customerRepository,
                braintree,
                sendEmail: async (m) => emails.push(m)
            })('signature', 'body')

            emails[0].to.should.be.eql(customer.email)
            emails[0].content.should.containEql(`https://jsreport.net/payments/customer/${customer.uuid}/product/${customer.products[0].id}`)
            emails[0].content.should.containEql('Please verify your bank credentials')
        })

        it('on cancel ', async () => {
            const customer = await customerRepository.findOrCreate('a@a.com')
            customer.products = [createProduct()]
            await customerRepository.update(customer)

            const braintree = <any>{}
            braintree.parseWebHook = (signature, body) => {
                body.should.be.eql('body')
                signature.should.be.eql('signature')
                return {
                    kind: 'subscription_canceled',
                    subscription: {
                        id: customer.products[0].braintree.subscription.id
                    }
                }
            }
            const emails: Array<Email> = []
            await braintreeHook({
                customerRepository,
                braintree,
                sendEmail: async (m) => emails.push(m)
            })('signature', 'body')

            emails[0].to.should.be.eql(customer.email)
            emails[0].content.should.containEql(`jsreport enterprise subscription was canceled because of multiple failed payments`)
        })

        it('on cancel should skip for already canceled subscription', async () => {
            const customer = await customerRepository.findOrCreate('a@a.com')
            customer.products = [createProduct()]
            customer.products[0].braintree.subscription.status = 'Canceled'
            await customerRepository.update(customer)

            const braintree = <any>{}
            braintree.parseWebHook = (signature, body) => {
                body.should.be.eql('body')
                signature.should.be.eql('signature')
                return {
                    kind: 'subscription_canceled',
                    subscription: {
                        id: customer.products[0].braintree.subscription.id
                    }
                }
            }
            const emails: Array<Email> = []
            await braintreeHook({
                customerRepository,
                braintree,
                sendEmail: async (m) => emails.push(m)
            })('signature', 'body')

            emails.should.have.length(0)
        })
    })
})
