import * as logger from '../utils/logger'
import * as mailer from '../utils/mailer'
import { Db } from 'mongodb'
import Braintree from './braintree'
import { CustomerRepository } from './customer'
import InvoiceCounter from './invoiceCounter'
import validateVat from './validateVat'
import RenderInvoice from './renderInvoice'
import checkout from './checkout'
import NotifyGumroad from './notifyGumroad'
import updatePaymentMethod from './updatePaymentMethod'
import cancelSubscription from './cancelSubscription'
import braintreeHook from './braintreeHook'


export default (braintree: Braintree, jsreportClient, db: Db, axios) => {
  const customerRepository = new CustomerRepository(db)
  const renderInvoice = RenderInvoice(jsreportClient)
  const invoiceCounter = InvoiceCounter(db)
  const notifyGumroad = NotifyGumroad(axios)

  return {
    generateToken() {
      return braintree.generateToken()
    },

    async validateVat(vatNumber = '') {
      return validateVat(vatNumber)
    },

    async checkout(paymentInfo) {
      return checkout(paymentInfo, {
        customerRepository,
        braintree,
        renderInvoice,
        invoiceCounter,
        notifyGumroad
      })
    },

    async updatePaymentMethod(customerId, productId, pm) {
      return updatePaymentMethod(customerId, productId, pm, {
        customerRepository,
        braintree
      })
    },

    async customer(id) {
      return customerRepository.find(id)
    },

    async invoice(customerId, invoiceId) {
      logger.info('Downloading invoice ' + invoiceId)
      return customerRepository.invoice(customerId, invoiceId)
    },

    async cancelSubscription(customerId, productId) {
      logger.info('Canceling subscription customerId:' + customerId + ' productId:' + productId)

      return cancelSubscription(customerId, productId, {
        customerRepository,
        braintree
      })
    },

    braintreeHook(signature, body) {
      logger.info('Parsing braintree hook')
      return braintreeHook({
        braintree,
        customerRepository,
        invoiceCounter,
        renderInvoice
      })(signature, body)
    }

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
    */
  }
}