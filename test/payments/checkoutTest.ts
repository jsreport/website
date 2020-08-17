import databaseTest from './databaseTest'
import { checkout, CheckoutRequest } from '../../src/lib/payments/checkout'
import { Customer, CustomerRepository, AccountingData, Product, Sale } from '../../src/lib/payments/customer'
import { Email } from '../../src/lib/utils/mailer'
import 'should'
import { Db } from 'mongodb'
import moment from 'moment'

databaseTest((getDb) => {
  function createCheckoutData(): CheckoutRequest {
    return {
      customerId: 'customerid',
      address: 'address',
      country: 'cz',
      amount: 295,
      isEU: true,
      currency: 'USD',
      name: 'jsreport s.r.o.',
      price: 295,
      product: {
        code: 'enterpriseSubscription',
        isSubscription: true,
        isSupport: false,
        name: 'jsreport enterprise subscription',
        permalink: 'permalink',
      },
      vatAmount: 0,
      vatRate: 0,
      vatNumber: 'CZ0102',
      paymentIntentId: 'paymentintentid',
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
      let customer = await customerRepository.findOrCreate('a@a.com')
      checkoutData.customerId = customer.uuid

      const stripe: any = {}

      stripe.findPaymentIntent = (paymentIntentId) => ({
        id: paymentIntentId,
        payment_method: {
          id: 'paymentmethod',
          card: {
            last4: 'XXXX',
            expMonth: 1,
            expYear: 1,
          },
        },
      })

      const emails: Array<Email> = []

      await checkout({
        stripe,
        customerRepository,
        sendEmail: (e) => emails.push(e),
        notifyLicensingServer: async (c: Customer, p: Product, s: Sale) => {
          c.email.should.be.eql(customer.email)
          p.should.be.ok()
          s.should.be.ok()
        },
        renderInvoice: async () => {},
      })(checkoutData)

      customer = await db.collection('customers').findOne({})
      customer.creationDate.should.be.Date()
      const product = customer.products[0]
      product.licenseKey.should.be.ok()
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
      moment(product.subscription.nextPayment).startOf('day').toDate().should.be.eql(moment().add(1, 'years').startOf('day').toDate())
      product.subscription.stripe.paymentMethodId.should.be.eql('paymentmethod')
      product.subscription.card.last4.should.be.ok()

      const sale = product.sales[0]
      sale.purchaseDate.should.be.Date()
      sale.purchaseDate.should.be.Date()
      JSON.stringify(sale.accountingData).should.be.eql(JSON.stringify(product.accountingData))

      emails.should.have.length(2)
      emails[0].to.should.be.eql(customer.email)
      emails[0].subject.should.containEql('enterprise subscription')
      emails[0].content.should.containEql(product.licenseKey)
    })
  })
})
