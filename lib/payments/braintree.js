const braintree = require('braintree')

module.exports = () => {
  const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  })

  return {
    generateToken () {
      return gateway.clientToken.generate({}).then(r => r.clientToken)
    },

    createCustomer (obj) {
      return gateway.customer.create(obj)
    },

    createPaymentMethod (obj) {
      return gateway.paymentMethod.create(obj)
    },

    createSubscription (obj) {
      return gateway.subscription.create(obj)
    },

    createSale (obj) {
      return gateway.transaction.sale(obj)
    },

    updateSubscription (obj) {
      return gateway.subscription.update(obj)
    },

    cancelSubscription (obj) {
      return gateway.subscription.cancelgateway.subscription.cancel(obj)
    },

    parseWebHook (obj) {
      return gateway.webhookNotification.parse(obj)
    },

    close () {
      return gateway.close()
    }
  }
}
