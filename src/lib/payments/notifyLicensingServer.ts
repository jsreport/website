import axios from 'axios'
import { Sale, Product, Customer } from './customer'


export const notifyLicensingServer = function (customer: Customer, product: Product, sale: Sale) {
    return axios.post('https://jsreportonline.net/gumroad-hook', {
        email: customer.email,
        purchaseDate: new Date(),
        license_key: product.licenseKey,
        braintreeSale: {
            productId: product.id,
            saleId: sale.id,
            customerId: customer.uuid
        },
        product_name: product.name,
        permalink: product.permalink
    })
}