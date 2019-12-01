import * as logger from '../utils/logger'
import { promisify } from 'util'
import ValidateVat from 'validate-vat'
import decodeXML from 'unescape'

const validateVatUtil = promisify(ValidateVat)

export default async function (vatNumber = '') {
    logger.debug('validating vat ' + vatNumber)
    try {
        const r = await validateVatUtil(vatNumber.slice(0, 2), vatNumber.substring(2))

        if (r.valid !== true) {
            throw new Error('Invalid VAT')
        }

        return {
            country: r.countryCode,
            name: decodeXML(r.name),
            address: decodeXML(r.address)
        }
    } finally {
        logger.debug('vat validation finished')
    }
}