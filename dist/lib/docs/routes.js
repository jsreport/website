"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doc = exports.pull = exports.staticResources = exports.learn = exports.engines = exports.nodejs = exports.recipes = exports.dotnet = exports.extensions = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const marked_1 = __importDefault(require("marked"));
const prismjs_1 = __importDefault(require("prismjs"));
const prism_languages_1 = __importDefault(require("prism-languages"));
const pull_1 = __importDefault(require("./pull"));
const process_1 = __importDefault(require("process"));
const logger = __importStar(require("../utils/logger"));
let cache = {};
let versions = ['latest'];
pull_1.default().then((vs) => {
    versions = vs;
}).catch(e => {
    logger.error('pulling docs failed', e);
    process_1.default.exit(1);
});
function highlight(code, lang, callback) {
    try {
        return callback(null, prismjs_1.default.highlight(code, prism_languages_1.default[lang]));
    }
    catch (err) {
        callback(err);
    }
}
function extensions(req, res) {
    const version = req.query.version || "latest";
    res.render(`learn/docs/${version}/pages/extensions`, { learn: true, versions, version });
}
exports.extensions = extensions;
;
function dotnet(req, res) {
    const version = req.query.version || "latest";
    res.render(`learn/docs/${version}/pages/dotnet`, { learn: true, versions, version });
}
exports.dotnet = dotnet;
;
function recipes(req, res) {
    const version = req.query.version || "latest";
    res.render(`learn/docs/${version}/pages/recipes`, { learn: true, versions, version });
}
exports.recipes = recipes;
;
function nodejs(req, res) {
    const version = req.query.version || "latest";
    res.render(`learn/docs/${version}/pages/nodejs`, { learn: true, versions, version });
}
exports.nodejs = nodejs;
;
function engines(req, res) {
    const version = req.query.version || "latest";
    res.render(`learn/docs/${version}/pages/engines`, { learn: true, versions, version });
}
exports.engines = engines;
;
function learn(req, res) {
    const version = req.query.version || "latest";
    res.render(`learn/docs/${version}/pages/learn`, { learn: true, versions, version });
}
exports.learn = learn;
;
function staticResources(req, res) {
    const version = req.query.version || "latest";
    const filePath = `views/learn/docs/${version}/static-resources/${req.params.file}`;
    res.sendfile(filePath);
}
exports.staticResources = staticResources;
;
async function pull(req, res, next) {
    try {
        versions = await pull_1.default();
        cache = {};
        res.send('done');
    }
    catch (e) {
        next(e);
    }
}
exports.pull = pull;
;
function doc(req, res) {
    const version = req.query.version || "latest";
    if (cache[req.params.doc + '-' + version]) {
        return res.render(`learn/docs/${version}/pages/doc`, {
            ...cache[req.params.doc + '-' + version],
            versions,
            version
        });
    }
    const docsTitlesPath = path.join(process_1.default.cwd(), "views", "learn", "docs", version, "docs", "docs.json");
    const docs = JSON.parse(fs.readFileSync(docsTitlesPath).toString());
    const filePath = path.join(process_1.default.cwd(), "views", "learn", "docs", version, "docs", req.params.doc + ".md");
    if (!fs.existsSync(filePath) || !docs[req.params.doc]) {
        return res.status(404).render("404");
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
            var tocHTML = `<div class='toc'>`;
            if (toc.length > 3 && req.params.doc !== 'faq' && req.params.doc !== 'online-faq') {
                tocHTML += '<h3>table of contents</h3>';
                tocHTML += '<div class="listview-outlook">';
                toc.forEach(function (entry) {
                    if (entry.level > 3) {
                        return;
                    }
                    tocHTML += '<a class="list marked" href="#' + entry.anchor + '"><div class="list-content level-' + entry.level + '">' + entry.text + '</div></a>\n';
                });
                tocHTML += '</div>';
            }
            tocHTML += '</div>';
            cache[req.params.doc + '-' + version] = {
                title: docs[req.params.doc],
                content: tocHTML + html,
                url: "https://jsreport.net" + req.url,
                id: req.params.doc,
                learn: true,
                linkDocCss: true
            };
            res.render(`learn/docs/${version}/pages/doc`, {
                ...cache[req.params.doc + '-' + version],
                versions,
                version
            });
        });
    });
}
exports.doc = doc;
;
//# sourceMappingURL=routes.js.map