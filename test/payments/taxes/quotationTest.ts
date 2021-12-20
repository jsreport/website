import quotation from '../../../src/lib/payments/taxes/quotation'
import moment from 'moment'
import 'should'

describe('quotation', () => {
    it('should return conversion rate', async () => {
        const r = await quotation(moment().format('DD.MM.YYYY'), 'USD')
        r.should.be.Number()
    })
})

