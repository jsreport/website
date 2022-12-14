import emailProcessor from '../../src/lib/payments/emailProcessor'
import products from '../../src/shared/products'
import fs from 'fs'
import { Product, Sale } from '../../src/lib/payments/customer'
import { Email } from '../../src/lib/utils/mailer'

describe('emailProcessor', () => {
  it('test', async () => {
    let emails: Email[] = []
    await emailProcessor((e) => emails.push(e), 'cancel', {
      _id: 'a',
      email: 'a@a.com',
      uuid: 'uuid',
      products: [],
      creationDate: new Date()
    }, {
      product: <Product> {
         id: 'id',
         name: products.enterpriseSubscription.name,
         licenseKey: 'foo',
         subscription: {
          nextPayment: new Date()
         }         
      },
      productDefinition: products.enterpriseSubscription,
      sale: <Sale>{
        blobName: 'b',
        id: 'id',
        accountingData: {},
        purchaseDate: new Date()
      }
    })

    fs.writeFileSync('email.html', emails[0].content)
  })
})
