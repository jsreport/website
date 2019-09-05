const payments = require('./lib/payments')
const path = require('path')

exports.onprem = function (req, res) {
  res.render('onprem', {
    onprem: true,
    title: 'jsreport - report server',
    description: 'Download jsreport on-prem version to your server in your company and use it without any limitations.'
  })
}

exports.playground = function (req, res) {
  res.render('playground', {
    playground: true,
    title: 'Try free jsreport online playground',
    description: 'Try free jsreport online fiddling tool. Share your reports with others. Embed report generation into your website.'
  })
}

exports.buyOnPrem = function (req, res) {
  res.render('buy', {
    buy: true,
    buyOnPrem: true,
    title: 'jsreport - buy',
    description: 'Buy jsreport license'
  })
}

exports.buySupport = function (req, res) {
  res.render('buy', {
    buy: true,
    buySupport: true,
    title: 'jsreport - buy',
    description: 'Buy jsreport support'
  })
}

exports.buyOnline = function (req, res) {
  res.render('buy', {
    buy: true,
    buyOnline: true,
    title: 'jsreport - buy',
    description: 'Buy jsreport online credits'
  })
}

exports.buyThankYou = function (req, res) {
  res.render('thank-you', {
    buy: true,
    title: 'jsreport - buy',
    description: 'Thank you'
  })
}

exports.online = function (req, res) {
  res.render('online', {
    online: true,
    title: 'jsreportonline - pdf reports as a service',
    description: 'Do not install anything. Just register to cloud based jsreportonline service and start creating reports now.'
  })
}

exports.onlinePricing = function (req, res) {
  res.render('online-pricing', {
    online: true,
    title: 'jsreportonline - pdf reports as a service',
    description: 'Do not install anything. Just register to cloud based jsreportonline service and start creating reports now.'
  })
}

exports.about = function (req, res) {
  res.render('about', { about: true, title: 'About jsreport' })
}

exports.downloads = function (req, res) {
  res.redirect('/on-prem')
}

exports.embedding = function (req, res) {
  res.render('embedding', {
    playground: true,
    title: 'Embed jsreport to any page'
  })
}

exports.showcases = function (req, res) {
  res.render('showcases', {
    title: 'jsreport - showcases',
    description: 'jsreport showcases'
  })
}

exports.contactEmail = db => (req, res) => {
  db()
    .collection('contacts')
    .insertOne({
      date: new Date(),
      email: req.body.contactEmail,
      enabledNewsletter: req.body.enabledNewsletter === 'true',
      type: req.body.type
    })
    .then(() => {
      // expire in 30seconds
      res.cookie('jsreport-contact-email-set', 'true', {
        maxAge: 30 * 60 * 1000
      })
      res.send('ok')
    })
    .catch(e => {
      console.error(e)
      res.send('error ' + e)
    })
}

exports.payments = (req, res) =>
  res.render(path.join(__dirname, '/dist/app.html'), {
    title: 'jsreport customers'
  })

exports.checkoutSubmit = db => (req, res, next) =>
  payments
    .checkout(req.body, db)
    .then(r => res.send(r))
    .catch(next)

exports.braintreeToken = (req, res, next) =>
  payments
    .generateToken()
    .then(r => res.send(r))
    .catch(next)

exports.validateVat = (req, res) =>
  payments
    .validateVat(req.body.vatNumber)
    .then(r => res.send(r))
    .catch(r => res.send({ valid: false }))

exports.customerApi = db => (req, res, next) =>
  payments
    .customer(req.params.id, db)
    .then(r => res.send(r))
    .catch(next)

exports.invoice = db => (req, res, next) =>
  payments
    .invoice(req.params.customerId, req.params.invoiceId, db)
    .then(buf => {
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename=${req.params.invoiceId}.pdf`)
      res.send(buf)
    })
    .catch(next)

exports.cancelSubscription = db => (req, res, next) =>
  payments
    .cancelSubscription(req.params.customerId, req.params.productId, db)
    .then(() => res.send({ result: 'ok' }))
    .catch(next)

exports.updatePaymentMethod = db => (req, res, next) =>
  payments
    .updatePaymentMethod(req.params.customerId, req.params.productId, req.body, db)
    .then(() => res.send({ result: 'ok' }))
    .catch(next)
