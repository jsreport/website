const Payments = require('../lib/payments/payments')
const MongoClient = require('mongodb').MongoClient
const logger = require('../lib/utils/logger')
require('should')
logger.init()

describe('payments', () => {
  let braintree
  let payments
  let db
  let dbClient

  before(async () => {
    const Client = new MongoClient('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    dbClient = await Client.connect()
    db = dbClient.db()
  })

  beforeEach(async () => {
    await db.dropDatabase()

    braintree = {}
    payments = Payments(braintree, db)
  })

  after(() => {
    dbClient.close()
  })

  it('validateVat should verify correct VAT', async () => {
    const res = await payments.validateVat('CZ05821916')
    res.country.should.be.eql('CZ')
    res.name.should.be.eql('jsreport s.r.o.')
    res.address.should.be.eql('Jičínská 226/17, PRAHA 3 - ŽIŽKOV, 130 00  PRAHA 3')
  })

  it('validateVat should throw on invalid address', () => {
    return payments.validateVat('wrong').should.be.rejected()
  })

  it('customer find', async () => {
    await db.collection('customers').insertOne({
      email: 'a@a.com',
      uuid: 'uuid'
    })
    const customer = await payments.customer('uuid')
    customer.email.should.be.eql('a@a.com')
    customer.uuid.should.be.eql('uuid')
  })
})
