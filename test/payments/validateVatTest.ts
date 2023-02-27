import validateVat from '../../src/lib/payments/validateVat'

describe('validate vat', () => {
  it('validateVat should verify correct VAT', async () => {
    const res = await validateVat('CZ05821916')
    res.country.should.be.eql('CZ')
    res.name.should.be.eql('jsreport s.r.o.')
    res.address.should.be.eql('Jičínská 226/17, PRAHA 3 - ŽIŽKOV, 130 00  PRAHA 3')
  })

  it('validateVat should unescape entities', async () => {
    const res = await validateVat('PL8522350387')
    res.name.should.be.eql('"FLUID DESK" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ')
  })

  it('validateVat should throw on invalid address', () => {
    return validateVat('wrong').should.be.rejected()
  })
})
