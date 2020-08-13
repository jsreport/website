import * as logger from '../utils/logger'
import { sendEmail } from '../utils/mailer'
import { Db } from 'mongodb'
import StripeFacade from './stripe'
import { CustomerRepository } from './customer'
import validateVat from './validateVat'
import { checkout, CheckoutRequest } from './checkout'
import { notifyLicensingServer } from './notifyLicensingServer'
import { updatePaymentMethod } from './updatePaymentMethod'
import { cancelSubscription } from './cancelSubscription'
import { Services } from './services'
import { renderInvoice, readInvoice } from './renderInvoice'
import { sendCustomerLink } from './sendCustomerLink'
import { stripeHook } from './stripeHook'

export default class Payments {
  db: Db
  customerRepository: CustomerRepository
  services: Services

  constructor(db: Db) {
    this.db = db
    this.customerRepository = new CustomerRepository(db)

    this.services = {
      customerRepository: this.customerRepository,
      stripe: new StripeFacade(),
      sendEmail,
      notifyLicensingServer,
      renderInvoice,
    }
  }

  async init() {}

  createPaymentIntent({ amount, email }) {
    return this.services.stripe.createPaymentIntent({
      amount: amount * 100,
      email,
    })
  }

  async validateVat(vatNumber = '') {
    return validateVat(vatNumber)
  }

  async checkout(checkoutData: CheckoutRequest) {
    return checkout(this.services)(checkoutData)
  }

  async updatePaymentMethod(customerId, productId, si) {
    return updatePaymentMethod(this.services)(customerId, productId, si)
  }

  async customer(id) {
    return this.customerRepository.find(id)
  }

  async invoice(customerId, saleId) {
    logger.info('Downloading invoice ' + saleId)
    const sale = await this.customerRepository.findSale(customerId, saleId)
    return readInvoice(sale.blobName)
  }

  async cancelSubscription(customerId, productId) {
    logger.info('Canceling subscription customerId:' + customerId + ' productId:' + productId)
    return cancelSubscription(this.services)(customerId, productId)
  }

  stripeHook(signature, body) {
    logger.info('Parsing stripe hook')
    return stripeHook(this.services)(signature, body)
  }

  customerLink(email) {
    logger.info('Request customer link ' + email)
    return sendCustomerLink(this.services)(email)
  }
}
