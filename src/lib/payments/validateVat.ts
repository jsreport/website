import * as logger from '../utils/logger'
import { promisify } from 'util'
import ValidateVat from 'validate-vat'
const validateVatUtil = promisify(ValidateVat)

export default async function (vatNumber = '') {
    logger.debug('validating vat ' + vatNumber)
    const r = await validateVatUtil(vatNumber.slice(0, 2), vatNumber.substring(2))

    if (r.valid !== true) {
        throw new Error('Invalid VAT')
    }

    return {
        country: r.countryCode,
        name: r.name,
        address: r.address
    }
}