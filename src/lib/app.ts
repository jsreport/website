require('dotenv').config()
import express from 'express'
import exphbs from 'express3-handlebars'
import Router from './router'
import * as docs from './docs'
import learnDocs from '../../views/learn/docs'
import multer from 'multer'
import bodyParser from 'body-parser'
import Reaper from 'reap2'
import * as path from 'path'
import * as logger from './utils/logger'
import { MongoClient } from 'mongodb'
import Braintree from './payments/braintree'
import Payments from './payments/payments'
import JsreportClient from 'jsreport-client'
import Posts from './posts'
import axios from 'axios'

const jsreportClient = JsreportClient(process.env.JO_URL, process.env.JO_USER, process.env.JO_PASSWORD)

const app = express()
logger.init()

let connectionString = 'mongodb://'

if (process.env.mongodb_username) {
  connectionString += process.env.mongodb_username + ':' + process.env.mongodb_password + '@'
}
connectionString += process.env.mongodb_address || 'localhost:27017'
connectionString += '/' + process.env.mongodb_authdb

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
let db
client.connect(err => {
  if (err) {
    console.error(err)
    process.exit()
  }

  console.log('Connected successfully to mongodb server')
  db = client.db('website')

  const payments = Payments(new Braintree(), jsreportClient, db, axios)
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
      }
    }
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
      description: 'jsreport is an open source reporting platform where reports are designed using popular javascript templating engines.'
    })
  })

  app.get('/learn/dotnet', docs.dotnet)
  app.get('/learn/nodejs', docs.nodejs)
  app.get('/learn/templating-engines', docs.engines)
  app.get('/learn/recipes', docs.recipes)
  app.get('/learn/extensions', docs.extensions)
  app.get('/learn/:doc', docs.doc)
  app.get('/learn', docs.learn)
  app.get('/examples/certificates', function (req, res) {
    return res.render('examples/certificates')
  })

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

  Posts(app).then(function (poet) {
    app.get('/sitemap*', function (req, res) {
      var postCount = poet.helpers.getPostCount()
      var posts = poet.helpers.getPosts(0, postCount)
      res.setHeader('Content-Type', 'application/xml')
      res.render('sitemap', {
        posts: posts,
        layout: false,
        docs: Object.keys(learnDocs)
      })
    })

    app.get('*', function (req, res) {
      res.status(404).render('404')
    })

    app.listen(process.env.PORT || 3000)
  }).catch(logger.error)

  app.get('/payments/customer/:customerId/invoice/:invoiceId', router.invoice)
  app.get('/payments/*', router.payments)
  app.post('/api/checkout', bodyParser.json(), router.checkoutSubmit)
  app.post('/api/validate-vat', bodyParser.json(), router.validateVat)
  app.get('/api/braintree-token', router.braintreeToken)
  app.get('/api/customer/:id', router.customerApi)
  app.delete('/api/customer/:customerId/subscription/:productId', router.cancelSubscription)
  app.put('/api/customer/:customerId/subscription/:productId', bodyParser.json(), router.updatePaymentMethod)
  app.post('/api/braintree/hook', bodyParser.urlencoded(), router.braintreeHook)

  app.use((err, req, res, next) => {
    logger.error('Error when processing ' + req.path + '; ' + err.stack)
    res.status(500).send({ error: err.message })
  })
})
