"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*eslint-disable */
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const express3_handlebars_1 = __importDefault(require("express3-handlebars"));
const router_1 = __importDefault(require("./router"));
const docs = __importStar(require("./docs"));
const docs_1 = __importDefault(require("../../views/learn/docs"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const reap2_1 = __importDefault(require("reap2"));
const path = __importStar(require("path"));
const logger = __importStar(require("./utils/logger"));
const mongodb_1 = require("mongodb");
const payments_1 = __importDefault(require("./payments/payments"));
const posts_1 = __importDefault(require("./posts"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
/* eslint-enable */
const app = express_1.default();
logger.init({
    level: process.env.LOGGLY_LEVEL,
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
});
logger.info('jsreport website starting');
let connectionString = 'mongodb://';
if (process.env.mongodb_username) {
    connectionString += process.env.mongodb_username + ':' + process.env.mongodb_password + '@';
}
connectionString += process.env.mongodb_address || 'localhost:27017';
connectionString += '/' + process.env.mongodb_authdb;
const client = new mongodb_1.MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let db;
client.connect((err) => {
    if (err) {
        console.error(err);
        process.exit();
    }
    logger.info('jsreport website sucessfully connected to the mongo');
    db = client.db('website');
    const payments = new payments_1.default(db);
    const router = router_1.default(payments, db);
    var reaper = new reap2_1.default({ threshold: 300000 });
    reaper.watch(path.join(__dirname, '../../', 'public', 'temp'));
    setInterval(() => {
        reaper.start((err, files) => {
            if (err) {
                console.error('Failed to delete temp file: ' + err);
            }
        });
    }, 10000).unref();
    var hbs = express3_handlebars_1.default.create({
        defaultLayout: 'main',
        extname: '.html',
        helpers: {
            fixCoding: function (content) {
                if (content.charAt(0) === '\uFEFF') {
                    content = content.substr(1);
                }
                return content;
            },
            toShortDate: function (date) {
                return require('moment')(date).format('MM-DD-YYYY');
            },
            toLongDate: function (date) {
                return require('moment')(date).format('MM-DD-YYYY HH:mm');
            },
        },
    });
    app.engine('.html', hbs.engine);
    // app.disable('view cache');
    app.set('view engine', '.html');
    app.use(express_1.default.static('public/'));
    app.use(express_1.default.static('dist/public'));
    app.use(multer_1.default({ dest: 'public/temp' }));
    app.post('/gumroad', body_parser_1.default.urlencoded({ extended: true, limit: '2mb' }), (req, res) => res.send('Ok'));
    app.post('/temp', function (req, res) {
        function findFirstFile() {
            for (var f in req.files) {
                if (req.files[f]) {
                    return req.files[f];
                }
            }
        }
        return res.send(require('path').basename(findFirstFile().path));
    });
    app.get('/', function (req, res) {
        res.render('home', {
            home: true,
            title: 'js' + 'report - javascript based reporting platform',
            description: 'jsreport is an open source reporting platform where reports are designed using popular javascript templating engines.',
        });
    });
    app.get('/learn/dotnet', docs.dotnet);
    app.get('/learn/nodejs', docs.nodejs);
    app.get('/learn/recipes', docs.recipes);
    app.get('/learn/extensions', docs.extensions);
    app.get('/learn/:doc', docs.doc);
    app.get('/learn', docs.learn);
    app.get('/examples/certificates', function (req, res) {
        return res.render('examples/certificates');
    });
    app.get('/online', router.online);
    app.get('/playground', router.playground);
    app.get('/on-prem', router.onprem);
    app.get('/about', router.about);
    app.get('/downloads', router.downloads);
    app.get('/embedding', router.embedding);
    app.get('/buy', router.buyOnPrem);
    app.get('/buy/on-prem', router.buyOnPrem);
    app.get('/buy/support', router.buySupport);
    app.get('/buy/online', router.buyOnline);
    app.get('/buy/thank-you', router.buyThankYou);
    app.get('/showcases', router.showcases);
    app.post('/contact-email', body_parser_1.default.urlencoded({ extended: true, limit: '2mb' }), router.contactEmail);
    payments
        .init()
        .then(() => posts_1.default(app))
        .then((poet) => {
        app.get('/sitemap*', function (req, res) {
            var postCount = poet.helpers.getPostCount();
            var posts = poet.helpers.getPosts(0, postCount);
            res.setHeader('Content-Type', 'application/xml');
            res.render('sitemap', {
                posts: posts,
                layout: false,
                docs: Object.keys(docs_1.default),
            });
        });
        app.get('*', function (req, res) {
            res.status(404).render('404');
        });
        app.listen(process.env.PORT || 3000);
    })
        .catch((e) => {
        logger.error('Failed to start server', e);
        process.exit();
    });
    const limiter = express_rate_limit_1.default({
        windowMs: 5000,
        max: 20,
    });
    const auth = express_basic_auth_1.default({
        users: { [process.env.USER]: process.env.PASSWORD },
        challenge: true,
    });
    app.get('/payments/taxes', [limiter, auth], router.taxes);
    app.post('/api/payments/taxes', [limiter, auth, body_parser_1.default.json()], router.createTaxes);
    app.get('/payments/customer/:customerId/invoice/:invoiceId', limiter, router.invoice);
    app.get('/payments/*', limiter, router.payments);
    app.post('/api/payments/checkout', [limiter, body_parser_1.default.json()], router.checkoutSubmit);
    app.post('/api/payments/validate-vat', [limiter, body_parser_1.default.json()], router.validateVat);
    app.post('/api/payments/customer-link', [limiter, body_parser_1.default.json()], router.customerLink);
    app.post('/api/payments/email-verification', [limiter, body_parser_1.default.json()], router.emailVerification);
    app.post('/api/payments/payment-intent', [limiter, body_parser_1.default.json()], router.createPaymentIntent);
    app.post('/api/payments/setup-intent', [limiter, body_parser_1.default.json()], router.createSetupIntent);
    app.get('/api/payments/customer/:id', limiter, router.customerApi);
    app.delete('/api/payments/customer/:customerId/subscription/:productId', limiter, router.cancelSubscription);
    app.put('/api/payments/customer/:customerId/subscription/:productId', [limiter, body_parser_1.default.json()], router.updatePaymentMethod);
    app.post('/api/payments/stripe/hook', [limiter, body_parser_1.default.raw({ type: 'application/json' })], router.stripeHook);
    app.get('/api/payments/stripe/client-secret', limiter, router.stripeClientSecret);
    app.use((err, req, res, next) => {
        logger.error('Error when processing ' + req.path + '; ' + err.stack);
        res.status(500).send({ error: err.message });
    });
    logger.info('jsreport website initialized');
});
//# sourceMappingURL=app.js.map