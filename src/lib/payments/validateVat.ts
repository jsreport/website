import * as logger from '../utils/logger'
import { promisify } from 'util'
import ValidateVat from 'validate-vat'
import decodeXML from 'unescape'

const validateVatUtil = promisify(ValidateVat)

async function test (vatNumber) {
  const r = await validateVatUtil(vatNumber.slice(0, 2), vatNumber.substring(2))
  if (r.valid !== true) {
    throw new Error('Invalid VAT: ' + r)
  }

  return {
    country: r.countryCode,
    name: decodeXML(r.name),
    address: decodeXML(r.address)
  }
}

export default async function (vatNumber = '') {
  logger.debug('validating vat ' + vatNumber)
  let lastE
  for (let i = 0; i < 5; i++) {
    try {
      return await test(vatNumber)
    } catch (e) {
      lastE = e
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
  throw lastE
}
