module.exports = function(app) {
    var poet = require('poet')(app, {
        postsPerPage: 300,
    });

    var marked = require("marked");

    marked.setOptions({
        highlight: function(code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });

    poet.addTemplate({
        ext: 'md',
        fn: function(s) { return marked(s); }
    });

    poet.addRoute('/blog/:post', function(req, res, next) {
        var post = poet.helpers.getPost(req.params.post);
        if (post) {
            res.render('post', {
                post: post,
                linkDocCss: true,
                url: "http://jsreport.net" + post.url,
                id: req.params.slug,
                blog: true
            });
        } else {
            res.send(404);
        }
    });

    poet.addRoute('/blog', function(req, res) {
        res.render('page', {
            posts: poet.helpers.getPosts(0, 300),
            blog: true
        });
    });


    return poet.init();
}