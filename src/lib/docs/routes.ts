import * as fs from 'fs'
import * as path from 'path'
import marked from 'marked'
import Prism from 'prismjs'
import languages from 'prism-languages'
import pullDocs from './pull'
import process from 'process'
import * as logger from '../utils/logger'
let cache = {}

let versions = ['latest']
pullDocs().then((vs) => {
    versions = vs
}).catch(e => {
    logger.error('pulling docs failed', e)
    process.exit(1)
})

function highlight(code, lang, callback) {
    try {
        return callback(null, Prism.highlight(code, languages[lang]));
    } catch (err) {
        callback(err)
    }
}

export function extensions(req, res) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/extensions`, { learn: true, versions, version });
};

export function dotnet(req, res) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/dotnet`, { learn: true, versions, version });
};

export function recipes(req, res) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/recipes`, { learn: true, versions, version });
};

export function nodejs(req, res) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/nodejs`, { learn: true, versions, version });
};

export function engines(req, res) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/engines`, { learn: true, versions, version });
};

export function learn(req, res) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/learn`, { learn: true, versions, version });
};

export function staticResources(req, res) {
    const version = req.query.version || "latest"
    const filePath = `views/learn/docs/${version}/static-resources/${req.params.file}`
    res.sendfile(filePath)
};


export async function pull(req, res, next) {
    try {
        versions = await pullDocs()
        cache = {}
        res.send('done')
    } catch (e) {
        next(e)
    }
};


export function doc(req, res) {
    const version = req.query.version || "latest"

    if (cache[req.params.doc + '-' + version]) {
        return res.render(`learn/docs/${version}/pages/doc`, {
            ...cache[req.params.doc + '-' + version],
            versions,
            version
        });
    }

    const docsTitlesPath = path.join(process.cwd(), "views", "learn", "docs", version, "docs", "docs.json");
    const docs = JSON.parse(fs.readFileSync(docsTitlesPath).toString())
    const filePath = path.join(process.cwd(), "views", "learn", "docs", version, "docs", req.params.doc + ".md");
    if (!fs.existsSync(filePath) || !docs[req.params.doc]) {
        return res.status(404).render("404");
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

        marked(content, { renderer: renderer, highlight: highlight }, function (err, html) {
            var tocHTML = `<div class='toc'>`

            if (toc.length > 3 && req.params.doc !== 'faq' && req.params.doc !== 'online-faq') {
                tocHTML += '<h3>table of contents</h3>';
                tocHTML += '<div class="listview-outlook">';
                toc.forEach(function (entry) {
                    if (entry.level > 3) {
                        return
                    }
                    tocHTML += '<a class="list marked" href="#' + entry.anchor + '"><div class="list-content level-' + entry.level + '">' + entry.text + '</div></a>\n';
                });
                tocHTML += '</div>';
            }

            tocHTML += '</div>'

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
};