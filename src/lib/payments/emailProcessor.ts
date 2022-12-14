import mjml2html from 'mjml'
import {promises as fs} from 'fs'
import path from 'path'
import { interpolate } from '../utils/utils'
import { Customer, Product } from './customer'
import moment from 'moment'

const config = {
    'checkout-license': {
        subject: 'You bought ${product.name}',
        sendUs: true
    },
    'checkout': {
        subject: 'You bought ${product.name}',
        sendUs: true
    },
    'recurring': {
        subject: '${product.name} renewal successful',
        sendUs: true
    },
    'recurringFail': {
        subject: '${product.name} renewal failed'
    },
    'customerLink': {
        subject: 'jsreport customer dashboard link'
    },
    'emailVerification': {
        subject: 'jsreport email verification'
    },
    'cancel': {
        subject: '${product.name} canceled',
        sendUs: true
    }
}

export default async function (sendEmail: (Mail: any) => void, type: string, customer: Customer, data: object) {    
    const emailFolder = path.join(process.cwd(), 'src/lib/payments/emails')
    const content = await fs.readFile(path.join(emailFolder,  `${type}.mjml`))    

    data = { ...data, customer, moment }

    await sendEmail({
        subject: interpolate(config[type].subject, data),
        to: customer.email,
        content: interpolate(mjml2html(content.toString(), {
            filePath: emailFolder
        }).html, data)
    })

    if (config[type].sendUs) {
        await sendEmail({
            subject: interpolate(config[type].subject, data),
            to: 'jan.blaha@jsreport.net',
            content: `${customer.email}<br><a href='https://jsreport.net/payments/customer/${customer.uuid}'>https://jsreport.net/payments/customer/${customer.uuid}</a><br>` 
             + interpolate(mjml2html(content.toString(), {
                filePath: emailFolder
            }).html, data)
        })
    }
} 
