import * as fs from 'fs'
import * as path from 'path'
import marked from 'marked'
import Prism from 'prismjs'
import languages from 'prism-languages'
import pullDocs from './pull'
import process from 'process'
import * as logger from '../utils/logger'
import cheerio from 'cheerio'

function fixDocsVersion(html, req) {
    // remove BOM
    html = html.charCodeAt(0) === 0xfeff ? html.slice(1) : html
    const version = req.query.version || "latest"
    const $ = cheerio.load(html)

    function fixUrl(url, version) {
        const base = url.split('?')[0].split('#')[0]
        const hash = url.split('#')[1]
        const search = version !== 'latest' ? '?version=' + version : ''
        return base + search + (hash ? '#' + hash : '')
    }

    $('a').each((index, a) => {
        const a$ = $(a)
        const href = a$.attr('href')
        if (href && href.indexOf('/learn') > -1) {
            a$.attr('href', fixUrl(href, version))
        }
    })

    $('img').each((index, img) => {
        const img$ = $(img)
        const src = img$.attr('src')
        if (src && src.indexOf('/learn') > -1) {
            img$.attr('src', fixUrl(src, version))
        }
    })

    return $.html()
}

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

export function extensions(req, res, next) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/extensions`, { learn: true, versions, version }, (err, html) => {
        if (err) {
            return next(err)
        }
        res.send(fixDocsVersion(html, req))
    })
};

export function dotnet(req, res, next) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/dotnet`, { learn: true, versions, version }, (err, html) => {
        if (err) {
            return next(err)
        }
        res.send(fixDocsVersion(html, req))
    })
};

export function recipes(req, res, next) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/recipes`, { learn: true, versions, version }, (err, html) => {
        if (err) {
            return next(err)
        }
        res.send(fixDocsVersion(html, req))
    })
};

export function nodejs(req, res, next) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/nodejs`, { learn: true, versions, version }, (err, html) => {
        if (err) {
            return next(err)
        }
        res.send(fixDocsVersion(html, req))
    })
};

export function engines(req, res, next) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/engines`, { learn: true, versions, version }, (err, html) => {
        if (err) {
            return next(err)
        }
        res.send(fixDocsVersion(html, req))
    })
};

export function learn(req, res, next) {
    const version = req.query.version || "latest"
    res.render(`learn/docs/${version}/pages/learn`, { learn: true, versions, version, title: 'Learn jsreport' }, (err, html) => {
        if (err) {
            return next(err)
        }
        res.send(fixDocsVersion(html, req))
    })
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


export function doc(req, res, next) {
    const version = req.query.version || "latest"

    if (cache[req.params.doc + '-' + version]) {
        // return cache[req.params.doc + '-' + version]        
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
            html = fixDocsVersion(html, req)

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


            res.render(`learn/docs/${version}/pages/doc`, {
                title: docs[req.params.doc],
                content: tocHTML + html,
                url: "https://jsreport.net" + req.url,
                id: req.params.doc,
                learn: true,
                linkDocCss: true,
                versions,
                version
            }, (err, html) => {
                if (err) {
                    return next(err)
                }
                html = fixDocsVersion(html, req)
                cache[req.params.doc + '-' + version] = html;
                return res.send(html)
            });
        });
    });
};