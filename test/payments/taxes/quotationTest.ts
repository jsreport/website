import quotation from '../../../src/lib/payments/taxes/quotation'
import 'should'

describe('quotation', () => {
    it('should return conversion rate', async () => {
        const r = await quotation(new Date(), 'USD')            
        r.should.be.Number()
    })  
})

