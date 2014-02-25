exports.onprem = function(req, res) {
    res.render("onprem", { onprem: true});
};

exports.playground = function(req, res) {
    res.render("playground", { playground: true});
};

exports.online = function(req, res) {
    res.render("online", { online: true});
};

exports.about = function(req, res) {
    res.render("about", { about: true});
};

exports.downloads = function(req, res) {
    res.render("downloads");
};