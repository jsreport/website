import axios from 'axios'
import { Product, Customer } from './customer'
import * as logger from '../utils/logger'


export const notifyWebhook = async function (customer: Customer, product: Product, event: string) {
    logger.info(`Processing webhook ${product.webhook} with customer.uuid: ${customer.uuid}, product.id: ${product.id}, product.planCode: ${product.planCode}`)
    const r = await axios.post(product.webhook, {        
        secret: process.env.PAYMENT_WEBHOOK_SECRET,
        event,
        customer: {
            email: customer.originalEmail || customer.email,
            uuid: customer.uuid,
            product: {
                id: product.id,
                planCode: product.planCode,
                subscription: product.subscription
            }
        }        
    })
    logger.info(`Webhook response ${r.status}, ${r.data}`)    
}