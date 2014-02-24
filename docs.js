var docs = require("./views/learn/docs.js"),
    fs = require("fs"),
    path = require("path"),
    marked = require("marked");

marked.setOptions({
    highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

exports.learn = function(req, res) {
    var items = [];
    for (var key in docs) {
        items.push({ title: docs[key], link: key });
    }

    res.render('learn/learn', {
        tutorials: items,
        learn: true
    });
};

exports.doc = function(req, res) {
    var filePath = path.join(__dirname, "views", "learn", "docs", req.params.doc + ".md");
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).render("404");
    }

    fs.readFile(filePath, 'UTF-8', function(err, content) {
        if (content.charAt(0) === '\uFEFF')
            content = content.substr(1);

        res.render('learn/doc', {
             content: marked(content),
             url: "http://jsreport.net" + req.url,
             id: req.params.doc,
             learn: true
        });
    });
};