import Stripe from 'stripe'
import * as logger from '../utils/logger'

export default class StripeFacade {
  stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-03-02',
    })
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

  async findPaymentMethod(paymentMethodId) {
    return this.stripe.paymentMethods.retrieve(paymentMethodId)
  }

  parseWebHook(signature, data) {
    return this.stripe.webhooks.constructEvent(data, signature, process.env.STRIPE_WEBHOOK_SECRET)
  }

  async findPaymentIntent(paymentIntentId) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method.card'],
    })
  }
}
