import databaseTest from './databaseTest'
import { CustomerRepository } from '../../src/lib/payments/customer'
import 'should'
import { Db } from 'mongodb'
import { updateCustomer } from '../../src/lib/payments/updateCustomer'


databaseTest((getDb) => {
  describe('updateCustomer', () => {
    let db: Db
    let customerRepository: CustomerRepository

    beforeEach(() => {
      db = getDb()
      customerRepository = new CustomerRepository(db)
    })

    it('should set originalEmail when changing email', async () => {
      let customer = await customerRepository.findOrCreate('original@email.com')            
      await updateCustomer(customerRepository)(customer.uuid, {
        email: 'new@email.com'
      })
      customer = await customerRepository.findByEmail('new@email.com')
      customer?.originalEmail?.should.be.eql('original@email.com')
    }) 
    
    it('should not set originalEmail when changing email multiple times', async () => {
      let customer = await customerRepository.findOrCreate('original@email.com')            
      await updateCustomer(customerRepository)(customer.uuid, {
        email: 'new@email.com'
      })
      await updateCustomer(customerRepository)(customer.uuid, {
        email: 'new2@email.com'
      })
      customer = await customerRepository.findByEmail('new2@email.com')
      customer?.originalEmail?.should.be.eql('original@email.com')
    }) 
  })
})
