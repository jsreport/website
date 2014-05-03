module.exports = function(app) {
    var poet = require('poet')(app, {
        postsPerPage: 300,
    });

    var marked = require("marked");

    marked.setOptions({
        highlight: function (code, lang, callback) {
            require('pygmentize-bundled')({ lang: lang, format: 'html', options: { nowrap: true }}, code, function (err, result) {
                callback(err, result.toString());
            });
        }
    });

    poet.addTemplate({
        ext: 'md',
        fn: function(s, cb) {
            marked(s, function (err, content) {
                if (err) return cb(err);
                cb(null, content);
            });
        }
    });

    poet.addRoute('/blog/:post', function(req, res, next) {
        var post = poet.helpers.getPost(req.params.post);
        if (post) {
            res.render('post', {
                post: post,
                linkDocCss: true,
                url: "http://jsreport.net" + post.url,
                id: req.params.slug,
                blog: true,
                lastPosts: poet.helpers.getPosts(0, 3),
                title: post.title,
            });
        } else {
            res.send(404);
        }
    });

    poet.addRoute('/blog', function(req, res) {
        res.render('page', {
            posts: poet.helpers.getPosts(0, 300),
            blog: true,
            title: "Blog about jsreport"
        });
    });


    return poet.init();
}