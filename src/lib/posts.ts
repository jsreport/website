import * as Prism from 'prismjs'
import * as languages from 'prism-languages'
import Poet from 'poet'
import marked from 'marked'

export default async function (app) {

    var poet = Poet(app, {
        postsPerPage: 300
    });

    var cache = {};

    marked.setOptions({
        highlight: function (code, lang, callback) {
            try {
                return callback(null, Prism.highlight(code, languages[lang]));
            } catch (err) {
                callback(err)
            }
        }
    });

    poet.addTemplate({
        ext: 'md',
        fn: function (s, cb) {
            marked(s, function (err, content) {
                if (err) return cb(err);
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
        } else {
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