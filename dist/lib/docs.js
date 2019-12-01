"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const docs = __importStar(require("../../views/learn/docs.js"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const marked_1 = __importDefault(require("marked"));
const prismjs_1 = __importDefault(require("prismjs"));
const prism_languages_1 = __importDefault(require("prism-languages"));
let cache = {};
function highlight(code, lang, callback) {
    try {
        return callback(null, prismjs_1.default.highlight(code, prism_languages_1.default[lang]));
    }
    catch (err) {
        callback(err);
    }
}
function extensions(req, res) {
    res.render('learn/extensions', { learn: true });
}
exports.extensions = extensions;
;
function dotnet(req, res) {
    res.render('learn/dotnet', { learn: true });
}
exports.dotnet = dotnet;
;
function recipes(req, res) {
    res.render('learn/recipes', { learn: true });
}
exports.recipes = recipes;
;
function nodejs(req, res) {
    res.render('learn/nodejs', { learn: true });
}
exports.nodejs = nodejs;
;
function engines(req, res) {
    res.render('learn/engines', { learn: true });
}
exports.engines = engines;
;
function learn(req, res) {
    res.render('learn/learn', { learn: true, title: "Learn jsreport" });
}
exports.learn = learn;
;
function doc(req, res) {
    var filePath = path.join(__dirname, '../../', "views", "learn", "docs", req.params.doc + ".md");
    if (!fs.existsSync(filePath) || !docs[req.params.doc]) {
        return res.status(404).render("404");
    }
    if (cache[req.params.doc]) {
        return res.render('learn/doc', cache[req.params.doc]);
    }
    fs.readFile(filePath, 'UTF-8', function (err, content) {
        if (content.charAt(0) === '\uFEFF')
            content = content.substr(1);
        var renderer = new marked_1.default.Renderer();
        var toc = [];
        var renderer = (function () {
            var renderer = new marked_1.default.Renderer();
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
        marked_1.default(content, { renderer: renderer, highlight: highlight }, function (err, html) {
            var tocHTML = '';
            if (toc.length > 3 && req.params.doc !== 'faq' && req.params.doc !== 'online-faq') {
                tocHTML = '<div class="toc">';
                tocHTML += '<h3>table of contents</h3>';
                tocHTML += '<div class="listview-outlook">';
                toc.forEach(function (entry) {
                    tocHTML += '<a class="list marked" href="#' + entry.anchor + '"><div class="list-content level-' + entry.level + '">' + entry.text + '</div></a>\n';
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
}
exports.doc = doc;
;
//# sourceMappingURL=docs.js.map