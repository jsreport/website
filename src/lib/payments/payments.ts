import * as logger from '../utils/logger'
import { sendEmail } from '../utils/mailer'
import { Db } from 'mongodb'
import Braintree from './braintree'
import { CustomerRepository } from './customer'
import validateVat from './validateVat'
import { checkout, CheckoutRequest } from './checkout'
import { notifyLicensingServer } from './notifyLicensingServer'
import { updatePaymentMethod } from './updatePaymentMethod'
import { cancelSubscription } from './cancelSubscription'
import { braintreeHook } from './braintreeHook'
import { Services } from './services'
import { renderInvoice, readInvoice } from './renderInvoice'

const braintree = new Braintree()

export default class Payments {
  db: Db
  customerRepository: CustomerRepository
  services: Services

  constructor(db: Db) {
    this.db = db
    this.customerRepository = new CustomerRepository(db)

    this.services = {
      customerRepository: this.customerRepository,
      braintree,
      sendEmail,
      notifyLicensingServer,
      renderInvoice
    }
  }

  generateToken() {
    return braintree.generateToken()
  }

  async validateVat(vatNumber = '') {
    return validateVat(vatNumber)
  }

  async checkout(checkoutData: CheckoutRequest) {
    return checkout(this.services)(checkoutData)
  }

  async updatePaymentMethod(customerId, productId, pm) {
    return updatePaymentMethod(this.services)(customerId, productId, pm)
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

  braintreeHook(signature, body) {
    logger.info('Parsing braintree hook')
    return braintreeHook(this.services)(signature, body)
  }
}
/*

export default (braintree: Braintree, jsreportClient, db: Db, axios) => {
  const customerRepository = new CustomerRepository(db)
  const createInvoice = CreateInvoice(jsreportClient, db)
  const notifyGumroad = NotifyGumroad(axios)



    /*
    const path = require('path')
    const signature = decodeURIComponent(
      require('fs')
        .readFileSync(path.join(__dirname, 'signature.txt'))
        .toString()
    )
    const body = decodeURIComponent(
      require('fs')
        .readFileSync(path.join(__dirname, 'body.txt'))
        .toString()
    )
    gateway.webhookNotification.parse(signature, body, function (err, webhookNotification) {
      console.log('[Webhook Received ' + webhookNotification.timestamp + '] | Kind: ' + webhookNotification.kind)

      // Example values for webhook notification properties
      console.log(webhookNotification.kind) // "subscriptionWentPastDue"
      console.log(webhookNotification.timestamp) // Sun Jan 1 00:00:00 UTC 2012
    })

  }
}
*/