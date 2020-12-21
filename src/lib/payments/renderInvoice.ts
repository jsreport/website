import * as logger from '../utils/logger'
import JsreportClient from 'jsreport-client'
import * as fs from 'fs'
import Promise from 'bluebird'
import * as path from 'path'
Promise.promisifyAll(fs)

const jsreportClient = JsreportClient(process.env.JO_URL, process.env.JO_USER, process.env.JO_PASSWORD)

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'))
}

if (!fs.existsSync(path.join(process.cwd(), 'data', 'invoices'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data', 'invoices'))
}

export const renderInvoice = async (data, templatePath = '/payments/invoice', fileExtension = 'pdf') => {
  logger.info('request invoice generation in jo')
  const renderResult = await jsreportClient.render({
    template: {
      name: templatePath
    },
    data
  })

  const buffer = await renderResult.body()
  return fs.writeFileSync(path.join(process.cwd(), 'data', 'invoices', data.id + '.' + fileExtension), buffer)
}

export const readInvoice = async (blobName: string) => {
  return fs.readFileSync(path.join(process.cwd(), 'data', 'invoices', blobName))
}
