import * as logger from '../utils/logger'
import { Services } from './services'
import moment, { Duration } from 'moment'
import { Customer, Product } from './customer'
import { interpolate } from '../utils/utils'
import { Emails } from './emails'

export default class SubscriptionRenewal {
  services: Services
  interval: Duration
  intervalRef: NodeJS.Timeout

  constructor(services: Services, interval?: Duration) {
    this.services = services
    this.interval = interval || moment.duration(1, 'minute')
  }

  start() {
    logger.info(`Initializing subscriptions timer to ${this.interval.asMinutes()}min`)
    this.intervalRef = setInterval(() => this.process(), this.interval.asMilliseconds())
  }

  stop() {
    this.intervalRef.unref()
  }

  async process() {
    logger.info('Processing subscriptions renewal')
    try {
      const customers: Customer[] = await this.services.customerRepository.findCustomersWithPastDueSubscriptions()

      for (const customer of customers) {
        for (const product of customer.products) {
          if (!product.isSubscription || product.subscription.state === 'canceled' || product.subscription.nextPayment > new Date()) {
            continue
          }

          if (product.subscription.retryPlannedPayment && product.subscription.retryPlannedPayment > new Date()) {
            continue
          }

          if (product.subscription.plannedCancelation && product.subscription.plannedCancelation > new Date()) {
            continue
          }

          await this.processSubscription(customer, product)
        }
      }

      logger.info('Processing subscriptions renewal ended')
    } catch (e) {
      logger.error('Critical error when processing subscriptions renew', e)
    }
  }

  async processSubscription(customer: Customer, product: Product) {
    logger.info(`Processing subscription renewal of ${product.name} for ${customer.email} started`)

    if (product.subscription.plannedCancelation) {
      return this._processCancellation(customer, product)
    }

    const lastSale = product.sales[product.sales.length - 1]
    let paymentIntent
    try {
      logger.info(`Initiating charge for ${product.name} for ${customer.email} of ${lastSale.accountingData.amount}USD`)
      const stripeCustomer = await this.services.stripe.findOrCreateCustomer(customer.email)
      paymentIntent = await this.services.stripe.createConfirmedPaymentIntent(
        stripeCustomer.id,
        product.subscription.stripe.paymentMethodId,
        lastSale.accountingData.amount
      )
    } catch (e) {
      if (product.subscription.retryPlannedPayment) {
        return this._processFirstFailedPayment(customer, product, e)
      } else {
        logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} errored but will retry`, e)
        product.subscription.retryPlannedPayment = moment(product.subscription.nextPayment).add(1, 'days').toDate()
        await this.services.customerRepository.update(customer)
      }
      return
    }

    return this.processSucesfullPayment(customer, product, paymentIntent)
  }

  async _processFirstFailedPayment(customer, product, e) {
    logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} errored and waiting for user`, e)
    product.subscription.retryPlannedPayment = null
    product.subscription.plannedCancelation = moment(product.subscription.nextPayment).add(1, 'months').toDate()
    await this.services.customerRepository.update(customer)

    await this.services.sendEmail({
      to: customer.email,
      content: interpolate(Emails.recurringFail.customer.content, { customer, product }),
      subject: interpolate(Emails.recurringFail.customer.subject, { customer, product }),
    })
    await this.services.sendEmail({
      to: 'jan.blaha@jsreport.net',
      content: interpolate(Emails.recurringFail.us.content, { customer, product }),
      subject: interpolate(Emails.recurringFail.us.subject, { customer, product }),
    })
  }

  async _processCancellation(customer, product) {
    logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} reached cancelation date`)
    product.subscription.retryPlannedPayment = null
    product.subscription.plannedCancelation = null
    product.subscription.state = 'canceled'
    return this.services.customerRepository.update(customer)
  }

  async processSucesfullPayment(customer, product, paymentIntent) {
    const lastSale = product.sales[product.sales.length - 1]
    const sale = await this.services.customerRepository.createSale(lastSale.accountingData, {
      paymentIntentId: paymentIntent.id,
    })

    await this.services.renderInvoice(sale)
    product.sales.push(sale)

    product.subscription.nextPayment = moment(product.subscription.nextPayment).add(1, 'years').toDate()
    product.subscription.state = 'active'
    product.subscription.retryPlannedPayment = null
    await this.services.customerRepository.update(customer)

    await this.services.notifyLicensingServer(customer, product, sale)

    await this.services.sendEmail({
      to: customer.email,
      content: interpolate(Emails.recurring.customer.content, { customer, product }),
      subject: interpolate(Emails.recurring.customer.subject, { customer, product }),
    })
    await this.services.sendEmail({
      to: 'jan.blaha@jsreport.net',
      content: interpolate(Emails.recurring.us.content, { customer, product }),
      subject: interpolate(Emails.recurring.us.subject, { customer, product }),
    })

    logger.info(`Processing subscription renewal of ${product.name} for ${customer.email} completed`)
  }
}
