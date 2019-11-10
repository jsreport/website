import * as logger from '../utils/logger'
import * as azure from 'azure-storage'
import JsreportClient from 'jsreport-client'
import Promise from 'bluebird'
import stream from 'stream'

const jsreportClient = JsreportClient(process.env.JO_URL, process.env.JO_USER, process.env.JO_PASSWORD)
const blobServiceAsync = Promise.promisifyAll(azure.createBlobService())


export const renderInvoice = async (data) => {
    logger.info('request invoice generation in jo')
    const renderResult = await jsreportClient.render({
        template: {
            name: '/payments/invoice'
        },
        data
    })

    const buffer = await renderResult.body()
    return blobServiceAsync.createBlockBlobFromTextAsync('invoices', data.id + '.pdf', buffer)
}

export const readInvoice = async (blobName: string) => {
    const data = []
    const writingStream = new stream.Writable({
        write: (chunk, encoding, next) => {
            data.push(chunk)
            next()
        }
    })

    await blobServiceAsync.getBlobToStreamAsync('invoices', blobName, writingStream)
    return Buffer.concat(data)
}

