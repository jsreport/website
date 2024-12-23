import { Services } from "../services"
import archiver from 'archiver'
const rimraf = require('util').promisify(require('rimraf'))
import * as mkdirp from 'mkdirp'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import moment from 'moment'
import { Sale } from "../customer"
import quotation from './quotation'
import { round } from '../../utils/utils'
import iconv from 'iconv-lite'
import countries from './countries'
import Stripe from 'stripe'

declare type Invoice = {
    date: Date,
    amount: number,
    id: string
}
declare type TaxesRequest = {
    gumroadInvoices: Array<Invoice>
    peru: Invoice
}

const tmpPath = path.join(os.tmpdir(), 'jsreport', 'taxes')

async function renderSale(services: Services, sale: Sale, templatePath: string) {
    await services.renderInvoice(sale, templatePath)
    const invoiceBuffer = await services.readInvoice(sale.id + '.pdf')
    fs.writeFileSync(path.join(tmpPath, 'data', sale.id + '.pdf'), invoiceBuffer)
}

async function calculateFees(stripeSales: Array<Sale>, gumroadInvoices: Array<Invoice>) {
    let incomes = 0
    for (const stripeSale of stripeSales) {
        incomes += stripeSale.accountingData.price
    }

    for (const gumroadInvoice of gumroadInvoices) {        
        const q =  await quotation(moment(gumroadInvoice.date).format('DD.MM.YYYY'), 'USD')        
        incomes += gumroadInvoice.amount / q
    }

    return round(incomes * 0.23)  
}

async function findStripeSales(services: Services) {
    const customers = await services.customerRepository.findCustomersWithInvoicesLastMonth()

    const startOfMonth = moment().add(-1, 'M').startOf('month').toDate()
    const endOfMonth = moment().add(-1, 'M').endOf('month').toDate()

    const sales = []
    for (const customer of customers) {
        for (const product of customer.products) {
            for (const sale of product.sales) {
                if (sale.purchaseDate > startOfMonth && sale.purchaseDate < endOfMonth) {
                    sales.push(sale)
                }
            }
        }
    }

    return sales
}

async function downloadStripeInvoices(services: Services, stripeSales: Array<Sale>) {
    for (const sale of stripeSales) {
        const invoiceBuffer = await services.readInvoice(sale.blobName)
        fs.writeFileSync(path.join(tmpPath, 'data', sale.blobName), invoiceBuffer)
    }
}

async function renderPohodaXml(services: Services, sales: Array<Sale>) {
    const id = new Date().getFullYear() + '-' + new Date().getMonth() + 'POHODA'

    for (const s of sales) {
        const countryEnum = countries.find(c => c.name === s.accountingData.country)
        s.accountingData.countryCode = countryEnum ? countryEnum.code : s.accountingData.country

        if (s.accountingData.currency === 'usd') {
            s.accountingData.currencyRate = await quotation(moment(s.purchaseDate).format('DD.MM.YYYY'), 'USD')
        }

        if (s.stripe) {           
            const pi = await services.stripe.findPaymentIntent(s.stripe.paymentIntentId)            
            if (pi.charges?.data && pi.charges?.data[0]?.balance_transaction) {
                const feeInCents = (<Stripe.BalanceTransaction>pi.charges.data[0].balance_transaction).fee
                Object.assign(s.accountingData, { fee: round(feeInCents / 100)})           
            }                           
        }                
    }

    await services.renderInvoice(<any>{
        id,
        items: sales
    }, '/payments/pohoda', 'xml')
    const invoicesXml = await services.readInvoice(`${id}.xml`)
    fs.writeFileSync(path.join(tmpPath, 'data', `${id}.xml`), iconv.encode(invoicesXml.toString(), 'win1250'))
}

function convertGumroadInvoiceToSale(invoice: Invoice): Sale {
    return {
        purchaseDate: new Date(invoice.date),
        id: invoice.id,
        blobName: invoice.id + '.pdf',
        accountingData: {
            name: 'Gumroad Inc, , San Francisco, CA',
            address: '225 Valencia St, San Francisco, California USA',
            country: 'United States',
            isEU: false,
            vatRate: 0,
            currency: 'czk',
            price: invoice.amount,
            amount: invoice.amount,
            item: 'Fees for the sold jsreport licenses',
            vatAmount: 0,
            vatNumber: null,
        }
    }
}

function convertPeruInvoiceToSale(invoice: Invoice): Sale {
    return {
        purchaseDate: new Date(invoice.date),
        id: invoice.id,
        blobName: invoice.id + '.pdf',
        accountingData: {
            name: 'Boris Matos Morillo',
            address: 'Jr San Clara Mz A5 Lt 2 Urb, San Martin de Porres',
            country: 'Peru',
            isEU: false,
            vatRate: 0,
            currency: 'usd',
            price: invoice.amount,
            amount: invoice.amount,
            item: 'jsreport implementation',
            vatAmount: 0,
            vatNumber: null,
            isExpense: true
        }
    }
}

async function createFeeSale(price): Promise<Sale> {
    const vatAmount = round(price * 0.21)
    const id = new Date().getFullYear() + '-' + new Date().getMonth() + 'F'
    return {
        purchaseDate: new Date(),
        id: id,
        blobName: id + '.pdf',
        accountingData: {
            name: 'Jan Blaha',
            address: 'U Sluncové 603/9, 186 00 Praha',
            country: 'Czech Republic',
            isEU: true,
            vatRate: 21,
            currencyRate: await quotation(moment(new Date()).format('DD.MM.YYYY'), 'USD'),
            currency: 'usd',
            price: price,
            amount: round(price + vatAmount),
            vatAmount,
            item: 'Fees for the sold jsreport licenses',
            vatNumber: 'CZ8501274529',
            isExpense: true
        }
    }
}

export const createTaxes = (services: Services) => async (data: TaxesRequest) => {
    await rimraf(tmpPath)
    mkdirp.sync(path.join(tmpPath, 'data'))

    const peruSale = convertPeruInvoiceToSale(data.peru)
    const gumroadSales = data.gumroadInvoices.map(convertGumroadInvoiceToSale)

    await renderSale(services, peruSale, '/payments/invoice peru')

    for (const gs of gumroadSales) {
        await renderSale(services, gs, '/payments/invoice gumroad')
    }

    const stripeSales = await findStripeSales(services)
    const feesAmount = await calculateFees(stripeSales, data.gumroadInvoices)
    const feeSale = await createFeeSale(feesAmount)
    await renderSale(services, feeSale, '/payments/invoice fee')

    await downloadStripeInvoices(services, stripeSales)
    await renderPohodaXml(services, [peruSale, ...gumroadSales, ...stripeSales, feeSale])

    const archive = archiver('zip')
    const output = fs.createWriteStream(path.join(tmpPath, 'taxes.zip'))
    archive.pipe(output)
    archive.directory(path.join(tmpPath, 'data'), false)

    await new Promise((resolve, reject) => {
        output.on('close', resolve)
        archive.on('error', reject)
        archive.finalize()
    })

    return fs.createReadStream(path.join(tmpPath, 'taxes.zip'))
}