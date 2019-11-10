import databaseTest from './databaseTest'
import { checkout, CheckoutRequest } from '../../src/lib/payments/checkout'
import { Customer, CustomerRepository, AccountingData, Product, Sale } from '../../src/lib/payments/customer'
import { Email } from '../../src/lib/utils/mailer'
import 'should'
import { Db } from 'mongodb'

databaseTest((getDb) => {
    function createCheckoutData(): CheckoutRequest {
        return {
            email: 'a@a.com',
            address: 'address',
            country: 'cz',
            amount: 295,
            isEU: true,
            currency: 'USD',
            name: 'jsreport s.r.o.',
            nonce: 'nonce',
            price: 295,
            product: {
                code: 'enterpriseSubscription',
                isSubscription: true,
                isSupport: false,
                name: 'jsreport enterprise subscription',
                permalink: 'permalink'
            },
            vatAmount: 0,
            vatRate: 0,
            vatNumber: 'CZ0102'
        }
    }

    describe('checkout', () => {
        let db: Db
        let customerRepository: CustomerRepository

        beforeEach(() => {
            db = getDb()
            customerRepository = new CustomerRepository(db)
        })

        it('subscription', async () => {
            const checkoutData = createCheckoutData()
            const braintree: any = {}

            braintree.createCustomer = () => ({ success: true, customer: { id: 'customerId' } })
            braintree.createPaymentMethod = (d) => {
                d.customerId.should.be.eql('customerId')
                d.paymentMethodNonce.should.be.eql('nonce')
                return { success: true, paymentMethod: { token: 'token' } }
            }
            braintree.createSubscription = (s) => {
                s.paymentMethodToken.should.be.eql('token')
                s.planId.should.be.eql('enterpriseSubscription')
                return { success: true, subscription: { nextBillingDate: new Date(2050, 1, 1) } }
            }

            const emails: Array<Email> = []
            let customer: Customer

            await checkout({
                braintree,
                customerRepository,
                sendEmail: (e) => emails.push(e),
                notifyLicensingServer: async (c: Customer, p: Product, s: Sale) => {
                    c.email.should.be.eql(checkoutData.email)
                    p.should.be.ok()
                    s.should.be.ok()
                },
                renderInvoice: async () => { }
            })(checkoutData)

            customer = await db.collection('customers').findOne({})
            customer.email.should.be.eql(checkoutData.email)
            customer.creationDate.should.be.Date()
            const product = customer.products[0]
            product.licenseKey.should.be.ok()
            product.subscription.nextBillingDate.should.be.Date()
            product.subscription.state.should.be.eql('active')
            product.accountingData.address.should.be.eql(checkoutData.address)
            product.accountingData.amount.should.be.eql(checkoutData.amount)
            product.accountingData.country.should.be.eql(checkoutData.country)
            product.accountingData.currency.should.be.eql(checkoutData.currency)
            product.accountingData.isEU.should.be.eql(checkoutData.isEU)
            product.accountingData.name.should.be.eql(checkoutData.name)
            product.accountingData.price.should.be.eql(checkoutData.price)
            product.accountingData.vatAmount.should.be.eql(checkoutData.vatAmount)
            product.accountingData.vatNumber.should.be.eql(checkoutData.vatNumber)
            product.accountingData.vatRate.should.be.eql(checkoutData.vatRate)
            product.braintree.paymentMethod.should.be.ok()
            product.braintree.subscription.should.be.ok()

            const sale = product.sales[0]
            sale.purchaseDate.should.be.Date()
            sale.purchaseDate.should.be.Date()
            JSON.stringify(sale.accountingData).should.be.eql(JSON.stringify(product.accountingData))

            emails.should.have.length(2)
            emails[0].to.should.be.eql(customer.email)
            emails[0].subject.should.containEql('enterprise subscription')
            emails[0].content.should.containEql(product.licenseKey)
        })

        it('onetime', async () => {
            const checkoutData = createCheckoutData()
            checkoutData.product.isSubscription = false

            let braintree = <any>{}
            braintree.createSale = (d) => {
                d.amount.should.be.eql(checkoutData.amount)
                d.paymentMethodNonce.should.be.eql(checkoutData.nonce)
            }

            await checkout({
                braintree,
                customerRepository,
                sendEmail: () => { },
                notifyLicensingServer: async (o) => ({}),
                renderInvoice: async () => { }
            })(checkoutData)


            const customer: Customer = await db.collection('customers').findOne({})
            customer.email.should.be.eql(checkoutData.email)
            customer.creationDate.should.be.Date()
            customer.products.should.have.length(1)
        })
    })
})
