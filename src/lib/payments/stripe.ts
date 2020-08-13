import Stripe from 'stripe'
import * as logger from '../utils/logger'

export default class StripeFacade {
  stripe: Stripe
  taxRateId: string
  productsMap: Map<string, string>

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-03-02',
    })
  }

  async init() {
    logger.info('loading stripe products and tax rates')
    this.productsMap = new Map()
    const prices = (await this.stripe.prices.list()).data
    const taxRates = (await this.stripe.taxRates.list()).data
    const products = (await this.stripe.products.list()).data

    for (let product of products) {
      this.productsMap.set(product.name, prices.find((p) => p.product === product.id).id)

      if (!this.productsMap.get(product.name)) {
        throw new Error(`Price for product ${product.name} not found in stripe`)
      }
    }
    this.taxRateId = taxRates.find((t) => t.jurisdiction === 'CZ').id

    if (products.length === 0) {
      throw new Error('No stripe products found')
    }

    if (!this.taxRateId) {
      throw new Error('No tax rate for CZ found')
    }

    logger.info(`stripe prices loaded (products: ${Array.from(this.productsMap.keys()).join(',')}`)
  }

  async createPaymentIntent({ amount, email }) {
    let customer = await this.findOrCreateCustomer(email)

    return this.stripe.paymentIntents
      .create({
        amount,
        currency: 'usd',
        customer: customer.id,
        setup_future_usage: 'off_session',
      })
      .then((r) => ({
        clientSecret: r.client_secret,
      }))
  }

  async findOrCreateCustomer(email) {
    const existingCustomers = await this.stripe.customers.list({
      email: email.toLowerCase(),
    })

    if (existingCustomers.data.length === 0) {
      const newCustomer = await this.stripe.customers.create({ email: email.toLowerCase() })
      console.log('created new', newCustomer)
      return newCustomer
    }

    return existingCustomers.data[0]
  }

  async testCharge(customerId: string, pi: Stripe.PaymentIntent) {
    try {
      console.log('creating test charge', pi.payment_method)
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 9000,
        currency: 'usd',
        customer: customerId,
        payment_method: <string>pi.payment_method,
        off_session: true,
        confirm: true,
      })
      console.log('done', paymentIntent)
    } catch (err) {
      // Error code will be authentication_required if authentication is needed
      console.log('Error code is: ', err.code)
      const paymentIntentRetrieved = await this.stripe.paymentIntents.retrieve(err.raw.payment_intent.id)
      console.log('PI retrieved: ', paymentIntentRetrieved.id)
    }
  }

  async createSubscription({ email, productName, vatApplied, paymentMethodId }) {
    logger.info('Subscription create ' + email)
    const customer = await this.findOrCreateCustomer(email)

    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    })

    if (!this.productsMap.has(productName)) {
      throw new Error(`Product "${productName}" not found in stripe products`)
    }

    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: this.productsMap.get(productName),
          tax_rates: vatApplied ? [this.taxRateId] : [],
        },
      ],
      proration_behavior: 'none',
      default_payment_method: paymentMethodId,
      off_session: true,
      expand: ['default_payment_method.card', 'latest_invoice.payment_intent'],
    })

    logger.info(`Subscription created (state: ${subscription.status})`)

    return subscription
  }

  findSubscription(subscriptionId) {
    return this.stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method.card', 'latest_invoice.payment_intent'],
    })
  }

  async findPaymentMethod(paymentMethodId) {
    return this.stripe.paymentMethods.retrieve(paymentMethodId)
  }

  async updateSubscription(id: string, customerId: string, paymentMethodId: string) {
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    return this.stripe.subscriptions.update(id, {
      default_payment_method: paymentMethodId,
      expand: ['default_payment_method.card'],
    })
  }

  cancelSubscription(id: string) {
    return this.stripe.subscriptions.del(id)
  }

  parseWebHook(signature, data) {
    return this.stripe.webhooks.constructEvent(data, signature, process.env.STRIPE_WEBHOOK_SECRET)
  }

  async findPaymentIntent(paymentIntentId) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId)
  }
}
