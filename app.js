var express = require('express'),
    exphbs = require('express3-handlebars'),
    app = express(),
    router = require("./router.js"),
    docs = require("./docs.js");

app.engine('.html', exphbs({defaultLayout: 'main', extname: ".html"}));
app.set('view engine', '.html');
app.use(express.static('public/'));

app.get('/', function (req, res) {
    res.render('home', { home: true});
});

app.get('/learn/:doc', docs.doc);
app.get('/learn', docs.learn);

app.get('/online', router.online);
app.get('/playground', router.playground);
app.get('/on-prem', router.onprem);
app.get('/about', router.about);

app.get('*', function(req, res) {
    res.status(404).render("404");
});

app.listen(process.env.PORT);

console.log('express3-handlebars example server listening on: 3000');