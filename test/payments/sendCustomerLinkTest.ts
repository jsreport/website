import databaseTest from './databaseTest'
import { CustomerRepository } from '../../src/lib/payments/customer'
import { sendCustomerLink } from '../../src/lib/payments/sendCustomerLink'
import 'should'
import { Db } from 'mongodb'
import { Email } from '../../src/lib/utils/mailer'

databaseTest((getDb) => {
  describe('send customer link', () => {
    let db: Db
    let customerRepository: CustomerRepository

    beforeEach(() => {
      db = getDb()
      customerRepository = new CustomerRepository(db)
    })

    it('should send no email when customer not found', async () => {
      const emails = []
      await sendCustomerLink({
        sendEmail: (e) => {
          emails.push(e)
        },
      })('wrongmail')

      emails.should.have.length(0)
    })

    it('should send email to customer', async () => {
      const customer = await customerRepository.findOrCreate('a@a.com')

      const emails: Array<Email> = []

      await sendCustomerLink({
        customerRepository,
        sendEmail: (e) => {
          emails.push(e)
        },
      })('a@a.com')

      require('fs').writeFileSync('email.html', emails[0].content)   
      emails.should.have.length(1)
      emails[0].to.should.be.eql('a@a.com')
      emails[0].content.should.containEql(customer.uuid)
    })
  })
})
