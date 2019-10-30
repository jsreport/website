import Payments from '../src/lib/payments/payments'
import { MongoClient, Db } from 'mongodb'
import * as logger from '../src/lib/utils/logger'
import 'should'

logger.init()

describe('payments', () => {
  let braintree
  let payments
  let db: Db
  let dbClient
  let jsreportClient
  let axios

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
    jsreportClient = { render: () => { } }
    axios = {}
    payments = Payments(braintree, jsreportClient, db, axios)
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

  it('checkout', async () => {
    await payments.checkout({
      email: 'a@a.com'
    })

    const customer = await db.collection('customers').findOne({})
    customer.email.should.be.eql('a@a.com')
  })
})
