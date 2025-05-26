import * as logger from '../utils/logger'
import { Services } from './services'
import moment, { Duration } from 'moment'
import { Customer, Product } from './customer'
import products from '../../shared/products'
import emailProcessor from './emailProcessor'

export default class SubscriptionRenewal {
  services: Services
  interval: Duration
  intervalRef: NodeJS.Timeout

  constructor(services: Services, interval?: Duration) {
    this.services = services
    this.interval = interval || moment.duration(10, 'minute')
  }

  start() {
    if (process.env.SUBSCRIPTION_RENEWAL_ENABLED === 'true') {
      logger.info(`Initializing subscriptions timer to ${this.interval.asMinutes()}min`)
      this.intervalRef = setInterval(() => this.process(), this.interval.asMilliseconds())
    } else {
      logger.info(`Subscription renewal interval disabled`)
    }
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

    let paymentIntent
    try {
      logger.info(`Initiating charge for ${product.name} for ${customer.email} of ${product.accountingData.amount} USD`)
      const stripeCustomer = await this.services.stripe.findOrCreateCustomer(customer.email) 
      const pm = await this.services.stripe.findPaymentMethod(product.subscription.stripe.paymentMethodId)      
      
      paymentIntent = await this.services.stripe.createConfirmedPaymentIntent(
        <string>pm.customer || stripeCustomer.id,
        product.subscription.stripe.paymentMethodId,
        product.accountingData.amount
      )
    } catch (e) {
      if (product.subscription.retryPlannedPayment) {
        return this._processSecondFailedPayment(customer, product, e)
      } else {
        logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} errored but will retry`, e)
        product.subscription.retryPlannedPayment = moment().add(1, 'days').toDate()
        await this.services.customerRepository.update(customer)
      }
      return
    }

    return this.processSucesfullPayment(customer, product, paymentIntent)
  }

  async _processSecondFailedPayment(customer, product, e) {
    logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} errored and waiting for user`, e)
    product.subscription.retryPlannedPayment = null
    product.subscription.plannedCancelation = moment(product.subscription.nextPayment).add(1, 'months').toDate()
    await this.services.customerRepository.update(customer)

    if (product.webhook) {
      await this.services.notifyWebhook(customer, product, 'cancel-planned')
    }

    await emailProcessor(this.services.sendEmail, 'recurringFail', customer, {
      product,
      productDefinition: products[product.code]
    })
  }

  async _processCancellation(customer, product) {
    logger.warn(`Processing subscription renewal of ${product.name} for ${customer.email} reached cancelation date`)
    product.subscription.retryPlannedPayment = null
    product.subscription.plannedCancelation = null
    product.subscription.state = 'canceled'
    await this.services.customerRepository.update(customer)
    if (product.webhook) {
      await this.services.notifyWebhook(customer, product, 'canceled')
    }
  }

  async processSucesfullPayment(customer, product: Product, paymentIntent) {
    const sale = await this.services.customerRepository.createSale(product.accountingData, {
      paymentIntentId: paymentIntent.id,
    })

    await this.services.renderInvoice(sale)
    product.sales.push(sale)

    const nextPayment = product.subscription.state === 'canceled' ? new Date() : product.subscription.nextPayment
    product.subscription.plannedCancelation = null
    product.subscription.nextPayment = product.subscription.paymentCycle === 'monthly' ?
      moment(nextPayment).add(1, 'months').toDate()
      : moment(nextPayment).add(1, 'years').toDate()
    product.subscription.state = 'active'
    product.subscription.retryPlannedPayment = null
    await this.services.customerRepository.update(customer)

    await this.services.notifyLicensingServer(customer, product, sale)
    if (product.webhook) {
      await this.services.notifyWebhook(customer, product, 'renewed')
    }

    await emailProcessor(this.services.sendEmail, 'recurring', customer, {
      product,
      sale,
      productDefinition: products[product.code]
    })

    logger.info(`Processing subscription renewal of ${product.name} for ${customer.email} completed`)
  }
}
