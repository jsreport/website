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
const Prism = __importStar(require("prismjs"));
const languages = __importStar(require("prism-languages"));
const poet_1 = __importDefault(require("poet"));
const marked_1 = __importDefault(require("marked"));
async function default_1(app) {
    var poet = poet_1.default(app, {
        postsPerPage: 300
    });
    var cache = {};
    marked_1.default.setOptions({
        highlight: function (code, lang, callback) {
            try {
                return callback(null, Prism.highlight(code, languages[lang]));
            }
            catch (err) {
                callback(err);
            }
        }
    });
    poet.addTemplate({
        ext: 'md',
        fn: function (s, cb) {
            marked_1.default(s, function (err, content) {
                if (err)
                    return cb(err);
                cb(null, content);
            });
        }
    });
    poet.addRoute('/blog/:post', function (req, res, next) {
        var post = poet.helpers.getPost(req.params.post);
        if (post) {
            if (cache[req.params.slug]) {
                return res.render('post', cache[req.params.post]);
            }
            cache[req.params.post] = {
                post: post,
                linkDocCss: true,
                url: "https://jsreport.net" + post.url,
                id: req.params.slug,
                blog: true,
                lastPosts: poet.helpers.getPosts(0, 3),
                title: post.title
            };
            res.render('post', cache[req.params.post]);
        }
        else {
            res.send(404);
        }
    });
    poet.addRoute('/blog', function (req, res) {
        res.render('page', {
            posts: poet.helpers.getPosts(0, 300),
            blog: true,
            title: "Blog about jsreport"
        });
    });
    return poet.init();
}
exports.default = default_1;
//# sourceMappingURL=posts.js.map