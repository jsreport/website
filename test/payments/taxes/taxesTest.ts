import databaseTest from './../databaseTest'
import { createTaxes } from '../../../src/lib/payments/taxes/taxes'
import { Customer, CustomerRepository, AccountingData, Product, Sale } from '../../../src/lib/payments/customer'
import 'should'
import { Db } from 'mongodb'
import moment from 'moment'
import * as path from 'path'
import { round } from '../../../src/lib/utils/utils'
import * as os from 'os'
import { createProduct } from './../helpers'
import decompress from 'decompress'
import streamToArray from 'stream-to-array'
import quotation from '../../../src/lib/payments/taxes/quotation'

const tmpPath = path.join(os.tmpdir(), 'jsreport', 'taxes')

databaseTest((getDb) => {
  describe('taxes', () => {
    let db: Db
    let customerRepository: CustomerRepository

    beforeEach(() => {
      db = getDb()
      customerRepository = new CustomerRepository(db)
    })

    it('create', async () => {
      const idPrefix = new Date().getFullYear() + '-' + new Date().getMonth()

      const customer = await customerRepository.findOrCreate('test')
      const product = createProduct()
      const sale = product.sales[0]
      sale.id = 'S1'
      sale.blobName = 'S1.pdf'
      sale.accountingData.amount = 30
      sale.accountingData.price = 30
      sale.purchaseDate = moment().add(-1, 'M').startOf('month').add(5, 'd').toDate()
      customer.products = [product]
      await customerRepository.update(customer)

      const renderedInvoices = {
        'S1': sale
      }
      const stream = await createTaxes({
        customerRepository,
        renderInvoice: async (data) => { renderedInvoices[data.id] = data; },
        readInvoice: async (blobName) => Buffer.from(JSON.stringify(renderedInvoices[path.basename(blobName, path.extname(blobName))]))
      })({
        gumroadInvoices: [{
          date: new Date(),
          amount: 10,
          id: 'G1'
        }, {
          date: new Date(),
          amount: 20,
          id: 'G2'
        }],
        peru: {
          id: 'P1',
          amount: 40,
          date: new Date()
        }
      })

      const parts = await streamToArray(stream)
      const files = await decompress(Buffer.concat(parts.map(p => Buffer.from(p))))

      const stripeInvoice = files.find(f => f.path === 'S1.pdf')
      JSON.parse(stripeInvoice.data.toString()).accountingData.amount.should.be.eql(30)

      const gumroadInvoice1 = files.find(f => f.path === 'G1.pdf')
      const g1Data = JSON.parse(gumroadInvoice1.data.toString())
      g1Data.accountingData.amount.should.be.eql(10)

      const gumroadInvoice2 = files.find(f => f.path === 'G2.pdf')
      const g2Data = JSON.parse(gumroadInvoice2.data.toString())
      g2Data.accountingData.amount.should.be.eql(20)

      const peruInvoice = files.find(f => f.path === 'P1.pdf')
      JSON.parse(peruInvoice.data.toString()).accountingData.amount.should.be.eql(40)

      const feeInvoice = files.find(f => f.path === `${idPrefix}F.pdf`)
      const feeData = JSON.parse(feeInvoice.data.toString())
      const g1USD = 10 / (await quotation(moment(g1Data.purchaseDate).format('DD.MM.YYYY'), 'USD'))
      const g2USD = 20 / (await quotation(moment(g2Data.purchaseDate).format('DD.MM.YYYY'), 'USD'))
      const feeUSD = round((g1USD + g2USD + 30) * 0.23)     
      
      feeData.accountingData.price.should.be.eql(feeUSD)
      feeData.accountingData.amount.should.be.eql(round(feeUSD  * 1.21))

      const invoicesExport = files.find(f => f.path === `${idPrefix}POHODA.xml`)
      const invoicesXmlData = JSON.parse(invoicesExport.data.toString())
      invoicesXmlData.items.should.have.length(5)
    })
  })
})
