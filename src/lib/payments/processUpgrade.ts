import { Product, Customer, Sale } from "./customer";
import { Services } from './services'
import products from '../../shared/products'
import * as logger from '../utils/logger'

export const processUpgrade = (services: Services) => async (customer: Customer, product: Product, sale: Sale) => {
    const productsThatCanBeUpgraded = customer.products.slice().reverse().filter(p => products[p.code].upgrade?.code == product.code)
    
    for (const p of productsThatCanBeUpgraded) {
        logger.warn('Performing upgrade ' + customer.email + ' ' + p.id)
        customer.products.find(cp => cp.id === p.id).upgradeDate = new Date()
        await services.notifyLicensingServer(customer, p, sale)
    }
    if (productsThatCanBeUpgraded.length === 0) {
        logger.warn('Unable to find customer product to upgrade for customer ' + customer.email)
    }
}