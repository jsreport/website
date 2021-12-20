/*eslint-disable */
require('dotenv').config()
import express from 'express'
import exphbs from 'express3-handlebars'
import Router from './router'
import * as docs from './docs/routes'
import multer from 'multer'
import bodyParser from 'body-parser'
import Reaper from 'reap2'
import * as path from 'path'
import * as fs from 'fs'
import * as logger from './utils/logger'
import { MongoClient } from 'mongodb'
import Payments from './payments/payments'
import Posts from './posts'
import rateLimit from 'express-rate-limit'
import basicAuth from 'express-basic-auth'
/* eslint-enable */
const app = express()
logger.init({
  level: process.env.LOGGLY_LEVEL,
  token: process.env.LOGGLY_TOKEN,
  subdomain: process.env.LOGGLY_SUBDOMAIN,
})

logger.info('jsreport website starting')

let connectionString = 'mongodb://'

if (process.env.mongodb_username) {
  connectionString += process.env.mongodb_username + ':' + process.env.mongodb_password + '@'
}
connectionString += process.env.mongodb_address || 'localhost:27017'
if (process.env.mongodb_authdb) {
  connectionString += '/' + process.env.mongodb_authdb
}

console.log('connect to', connectionString)
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
let db
client.connect((err) => {
  if (err) {
    console.error(err)
    process.exit()
  }

  logger.info('jsreport website sucessfully connected to the mongo')
  db = client.db('website')

  const payments = new Payments(db)
  const router = Router(payments, db)

  var reaper = new Reaper({ threshold: 300000 })
  reaper.watch(path.join(__dirname, '../../', 'public', 'temp'))
  setInterval(() => {
    reaper.start((err, files) => {
      if (err) {
        console.error('Failed to delete temp file: ' + err)
      }
    })
  }, 10000).unref()

  var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.html',
    helpers: {
      fixCoding: function (content) {
        if (content.charAt(0) === '\uFEFF') {
          content = content.substr(1)
        }
        return content
      },
      toShortDate: function (date) {
        return require('moment')(date).format('MM-DD-YYYY')
      },
      toLongDate: function (date) {
        return require('moment')(date).format('MM-DD-YYYY HH:mm')
      },
      ifEql: function (a, b, o) {
        return a === b ? o.fn(this) : o.inverse(this)
      },
      dump: function (data) {
        return 'dump' + JSON.stringify(data)
      }
    },
  })

  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY')
    next()
  })
  app.engine('.html', hbs.engine)
  // app.disable('view cache');
  app.set('view engine', '.html')

  app.use(express.static('public/'))
  app.use(express.static('dist/public'))
  app.use(multer({ dest: 'public/temp' }))

  app.post('/gumroad', bodyParser.urlencoded({ extended: true, limit: '2mb' }), (req, res) => res.send('Ok'))

  app.post('/temp', function (req: any, res) {
    function findFirstFile() {
      for (var f in req.files) {
        if (req.files[f]) {
          return req.files[f]
        }
      }
    }

    return res.send(require('path').basename(findFirstFile().path))
  })

  app.get('/', function (req, res) {
    res.render('home', {
      home: true,
      title: 'js' + 'report - javascript based reporting platform',
      description: 'jsreport is an open source reporting platform where reports are designed using popular javascript templating engines.',
    })
  })

  app.get('/learn/dotnet', docs.dotnet)
  app.get('/learn/nodejs', docs.nodejs)
  app.get('/learn/recipes', docs.recipes)
  app.get('/learn/extensions', docs.extensions)
  app.get('/learn/pull', docs.pull)
  app.get('/learn/:doc', docs.doc)
  app.get('/learn', docs.learn)
  app.get('/learn/static-resources/:file', docs.staticResources)

  app.get('/online', router.online)
  app.get('/playground', router.playground)
  app.get('/on-prem', router.onprem)
  app.get('/about', router.about)
  app.get('/downloads', router.downloads)
  app.get('/embedding', router.embedding)
  app.get('/buy', router.buyOnPrem)
  app.get('/buy/on-prem', router.buyOnPrem)
  app.get('/buy/support', router.buySupport)
  app.get('/buy/online', router.buyOnline)
  app.get('/buy/thank-you', router.buyThankYou)
  app.get('/showcases', router.showcases)
  app.post('/contact-email', bodyParser.urlencoded({ extended: true, limit: '2mb' }), router.contactEmail)

  let learnDocs
  payments
    .init()
    .then(() => Posts(app))
    .then((poet) => {
      app.get('/sitemap*', function (req, res) {
        if (!learnDocs) {
          learnDocs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'views', 'learn', 'docs', 'latest', 'docs', 'docs.json')).toString())
        }
        var postCount = poet.helpers.getPostCount()
        var posts = poet.helpers.getPosts(0, postCount)
        res.setHeader('Content-Type', 'application/xml')
        res.render('sitemap', {
          posts: posts,
          layout: false,
          docs: Object.keys(learnDocs),
        })
      })

      app.get('*', function (req, res) {
        res.status(404).render('404')
      })

      logger.info('App running on port ' + (process.env.PORT || 3000))
      app.listen(process.env.PORT || 3000)
    })
    .catch((e) => {
      logger.error('Failed to start server', e)
      process.exit()
    })

  const limiter = rateLimit({
    windowMs: 5000,
    max: 20,
  })

  const auth = basicAuth({
    users: { [process.env.USER]: process.env.PASSWORD },
    challenge: true,
  })

  app.get('/payments/taxes', [limiter, auth], router.taxes)
  app.post('/api/payments/taxes', [limiter, auth, bodyParser.json()], router.createTaxes)

  app.get('/payments/customer/:customerId/invoice/:invoiceId', limiter, router.invoice)
  app.get('/payments/*', limiter, router.payments)
  app.post('/api/payments/checkout', [limiter, bodyParser.json()], router.checkoutSubmit)
  app.post('/api/payments/validate-vat', [limiter, bodyParser.json()], router.validateVat)
  app.post('/api/payments/customer-link', [limiter, bodyParser.json()], router.customerLink)
  app.post('/api/payments/email-verification', [limiter, bodyParser.json()], router.emailVerification)
  app.post('/api/payments/payment-intent', [limiter, bodyParser.json()], router.createPaymentIntent)
  app.post('/api/payments/setup-intent', [limiter, bodyParser.json()], router.createSetupIntent)
  app.get('/api/payments/customer/:id', limiter, router.customerApi)
  app.delete('/api/payments/customer/:customerId/subscription/:productId', limiter, router.cancelSubscription)
  app.put('/api/payments/customer/:customerId/subscription/:productId', [limiter, bodyParser.json()], router.updatePaymentMethod)
  app.post('/api/payments/stripe/hook', [limiter, bodyParser.raw({ type: 'application/json' })], router.stripeHook)
  app.get('/api/payments/stripe/client-secret', limiter, router.stripeClientSecret)

  app.use((err, req, res, next) => {
    logger.error('Error when processing ' + req.path + '; ' + err.stack)
    res.status(500).send({ error: err.message })
  })

  logger.info('jsreport website initialized')
})
