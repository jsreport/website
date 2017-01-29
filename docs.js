var docs = require("./views/learn/docs.js"),
    fs = require("fs"),
    path = require("path"),
    marked = require("marked"),
    cache = {};


function highlight(code, lang, callback) {
    require('pygmentize-bundled')({lang: lang, format: 'html', options: {nowrap: true}}, code, function (err, result) {
        if (err) {
            return callback(err, code);
        }

        callback(err, result.toString());
    });
}

exports.extensions = function (req, res) {
    res.render('learn/extensions', {learn: true});
};

exports.dotnet = function (req, res) {
    res.render('learn/dotnet', {learn: true});
};

exports.recipes = function (req, res) {
    res.render('learn/recipes', {learn: true});
};

exports.nodejs = function (req, res) {
    res.render('learn/nodejs', {learn: true});
};

exports.engines = function (req, res) {
    res.render('learn/engines', {learn: true});
};

exports.learn = function (req, res) {
    res.render('learn/learn', {learn: true, title: "Learn jsreport"});
};

exports.doc = function (req, res) {
    var filePath = path.join(__dirname, "views", "learn", "docs", req.params.doc + ".md");

    if (!fs.existsSync(filePath) || !docs[req.params.doc]) {
        return res.status(404).render("404");
    }

    if (cache[req.params.doc]) {
        return res.render('learn/doc', cache[req.params.doc]);
    }

    fs.readFile(filePath, 'UTF-8', function (err, content) {
        if (content.charAt(0) === '\uFEFF')
            content = content.substr(1);
        var renderer = new marked.Renderer();

        var toc = [];
        var renderer = (function () {
            var renderer = new marked.Renderer();
            renderer.heading = function (text, level, raw) {
                var anchor = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
                toc.push({
                    anchor: anchor,
                    level: level,
                    text: text
                });
                return '<h'
                    + level
                    + ' id="'
                    + anchor
                    + '">'
                    + text
                    + '</h'
                    + level
                    + '>\n';
            };

            return renderer;
        })();

        marked(content, {renderer: renderer, highlight: highlight}, function (err, html) {
            var tocHTML = ''
            if (toc.length > 3 && req.params.doc !== 'faq') {
                tocHTML = '<div class="toc">'
                tocHTML += '<h3>table of contents</h3>';
                tocHTML += '<div class="listview-outlook">';
                toc.forEach(function (entry) {
                    tocHTML += '<a class="list marked" href="#' + entry.anchor + '"><div class="list-content level-' +  entry.level + '">'  + entry.text + '</div></a>\n';
                });
                tocHTML += '</div></div>\n';
            }

            cache[req.params.doc] = {
                title: docs[req.params.doc],
                content: tocHTML + html,
                url: "https://jsreport.net" + req.url,
                id: req.params.doc,
                learn: true,
                linkDocCss: true
            };

            res.render('learn/doc', cache[req.params.doc]);
        });
    });
};