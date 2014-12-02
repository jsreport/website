var express = require('express'),
    exphbs = require('express-handlebars'),
    app = express(),
    router = require("./router.js"),
    docs = require("./docs.js"),
    multer  = require('multer');


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
app.set('view engine', '.html');

app.use(express.static('public/'));

app.use(multer({ dest: "public/temp"}));


app.post('/temp', function(req, res) {
    function findFirstFile() {
        for (var f in req.files) {
            if (req.files.hasOwnProperty(f)) {
                return req.files[f];
            }
        }
    }

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

app.get('/learn/nodejs', docs.nodejs);
app.get('/learn/templating-engines', docs.engines);
app.get('/learn/recipes', docs.recipes);
app.get('/learn/extensions', docs.extensions);
app.get('/learn/visual-studio-and-net', docs.vsNet);
app.get('/learn/:doc', docs.doc);
app.get('/learn', docs.learn);
app.get('/examples/certificates', function(req, res) {
    return res.render("examples/certificates");
});


app.get('/online', router.online);
app.get('/online/pricing', router.onlinePricing);
app.get('/playground', router.playground);
app.get('/on-prem', router.onprem);
app.get('/about', router.about);
app.get('/downloads', router.downloads);
app.get('/embedding', router.embedding);


require("./posts.js")(app).then(function(poet) {
  
    
    app.get('/sitemap*', function(req, res) {
        var postCount = poet.helpers.getPostCount();
        var posts = poet.helpers.getPosts(0, postCount);
        res.setHeader('Content-Type', 'application/xml');
        res.render('sitemap', { posts: posts, layout: false });
    });
  

    app.get('*', function(req, res) {
        res.status(404).render("404");
    });
    
    app.listen(process.env.PORT || 1000);
});