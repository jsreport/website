var express = require('express'),
    exphbs = require('express3-handlebars'),
    app = express(),
    router = require("./router.js"),
    docs = require("./docs.js");

var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: ".html",
    helpers: {
        fixCoding: function(content) {
            if (content.charAt(0) === '\uFEFF')
                content = content.substr(1);
            return content;
        }
    }
});

app.engine('.html', hbs.engine);
app.set('view engine', '.html');
app.use(express.static('public/'));

app.get('/', function(req, res) {
    res.render('home', { home: true });
});

app.get('/learn/:doc', docs.doc);
app.get('/learn', docs.learn);

app.get('/online', router.online);
app.get('/playground', router.playground);
app.get('/on-prem', router.onprem);
app.get('/about', router.about);
app.get('/downloads', router.downloads);

app.get('*', function(req, res) {
    res.status(404).render("404");
});

app.listen(process.env.PORT);

console.log('express3-handlebars example server listening on: 3000');