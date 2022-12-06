import * as logger from '../utils/logger'
import { sendEmail } from '../utils/mailer'
import { Db } from 'mongodb'
import StripeFacade from './stripe'
import { CustomerRepository } from './customer'
import validateVat from './validateVat'
import { checkout, CheckoutRequest } from './checkout'
import { notifyLicensingServer } from './notifyLicensingServer'
import { notifyWebhook } from './notifyWebhook'
import { updatePaymentMethod } from './updatePaymentMethod'
import { cancelSubscription } from './cancelSubscription'
import { Services } from './services'
import { renderInvoice, readInvoice } from './renderInvoice'
import { sendCustomerLink } from './sendCustomerLink'
import SubscriptionRenewal from './subscriptionRenewal'
import { emailVerification } from './emailVerification'
import { createTaxes } from './taxes/taxes.js'

export default class Payments {
  db: Db
  customerRepository: CustomerRepository
  services: Services
  subscriptionRenewal: SubscriptionRenewal

  constructor(db: Db) {
    this.db = db
    this.customerRepository = new CustomerRepository(db)

    this.services = {
      customerRepository: this.customerRepository,
      stripe: new StripeFacade(),
      sendEmail,
      notifyLicensingServer,
      notifyWebhook,
      renderInvoice,
      readInvoice
    }

    this.subscriptionRenewal = new SubscriptionRenewal(this.services)
  }

  async init() {
    this.subscriptionRenewal.start()
  }

  async createPaymentIntent({ amount, customerId }) {
    const customer = await this.services.customerRepository.find(customerId)
    return {
      intent: await this.services.stripe.createPaymentIntent({
        amount: amount,
        email: customer.email,
      })
    }
  }

  async createSetupIntent({ customerId }) {
    const customer = await this.services.customerRepository.find(customerId)
    return {
      intent: await this.services.stripe.createSetupIntent({ email: customer.email })
    }
  }

  async validateVat(vatNumber = '') {
    return validateVat(vatNumber)
  }

  async checkout(checkoutData: CheckoutRequest) {
    return checkout(this.services)(checkoutData)
  }

  async updatePaymentMethod(customerId, productId, si) {
    return updatePaymentMethod(this.services, this.subscriptionRenewal.processSucesfullPayment.bind(this.subscriptionRenewal))(customerId, productId, si)
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

  customerLink(email) {
    logger.info('Request customer link ' + email)
    return sendCustomerLink(this.services)(email)
  }

  async stripeHook() {
    // nothing for now
  }

  emailVerification(email, productCode) {
    return emailVerification(this.services)(email, productCode)
  }

  createTaxes(data) {
    return createTaxes(this.services)(data)
  }
}
