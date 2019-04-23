var express = require('express'),
    exphbs = require('express3-handlebars'),
    app = express(),    
    router = require("./router.js"),
    docs = require("./docs.js"),
    learnDocs = require("./views/learn/docs.js")
    multer = require("multer"),
    bodyParser = require("body-parser"),
    Reaper = require('reap2')
    path = require('path')
    MongoClient = require('mongodb').MongoClient


let connectionString = 'mongodb://'

if (process.env.mongodb_username) {
    connectionString += process.env.mongodb_username + ':' + process.env.mongodb_password + '@'
}
connectionString +=  process.env.mongodb_address || 'localhost:27017'
connectionString +=  '/' + process.env.mongodb_authdb

const client = new MongoClient(connectionString)
let db
client.connect((err) => {  
  if (err) {
      console.error(err)
      process.exit()
  }

  console.log("Connected successfully to mongodb server");
  db = client.db('website');  
});



var reaper = new Reaper({threshold: 300000})   
reaper.watch(path.join(__dirname, 'public', 'temp'))
setInterval(() => {
    reaper.start((err, files) => {
      if (err) {
        console.error('Failed to delete temp file: ' + err)
      }
    })
}, 10000).unref()

var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: ".html",
    helpers: {
        fixCoding: function(content) {
            if (content.charAt(0) === '\uFEFF')
                content = content.substr(1);
            return content;
        },
        toShortDate: function(date) {
            return require("moment")(date).format("MM-DD-YYYY");
        },
        toLongDate: function(date) {
            return require("moment")(date).format("MM-DD-YYYY HH:mm");
        }
    }
});

app.engine('.html', hbs.engine);
// app.disable('view cache');
app.set('view engine', '.html');

app.use(express.static('public/'));

app.use(multer({ dest: "public/temp"}));

app.post('/gumroad', bodyParser.urlencoded({extended: true, limit: "2mb"}), function(req, res) {
    res.send('Ok');
});



app.post('/temp', function(req, res) {
    function findFirstFile() {
        console.log(req.files)
        for (var f in req.files) {
            if (req.files.hasOwnProperty(f)) {
                return req.files[f];
            }
        }
    }

    console.log(req)
    
    return res.send(require("path").basename(findFirstFile(0).path));
});

app.get('/', function(req, res) {
    res.render('home', {
        home: true,
        title: "js" +
            "report - javascript based reporting platform",
        description: "jsreport is an open source reporting platform where reports are designed using popular javascript templating engines."
    });
});

app.get('/learn/dotnet', docs.dotnet);
app.get('/learn/nodejs', docs.nodejs);
app.get('/learn/templating-engines', docs.engines);
app.get('/learn/recipes', docs.recipes);
app.get('/learn/extensions', docs.extensions);
app.get('/learn/:doc', docs.doc);
app.get('/learn', docs.learn);
app.get('/examples/certificates', function(req, res) {
    return res.render("examples/certificates");
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
app.post('/contact-email', bodyParser.urlencoded({extended: true, limit: "2mb"}), router.contactEmail(() => db));

require("./posts.js")(app).then(function(poet) { 
    
    app.get('/sitemap*', function(req, res) {
        var postCount = poet.helpers.getPostCount();
        var posts = poet.helpers.getPosts(0, postCount);
        res.setHeader('Content-Type', 'application/xml');
        res.render('sitemap', { posts: posts, layout: false, docs: Object.keys(learnDocs) });
    });
  

    app.get('*', function(req, res) {
        res.status(404).render("404");
    });
    
    app.listen(process.env.PORT || 4000);
});
