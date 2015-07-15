exports.onprem = function(req, res) {
    res.render("onprem", {
         onprem: true, 
         title: "jsreport - report server",
         description: "Download jsreport on-prem version to your server in your company and use it without any limitations."
    });
};

exports.playground = function(req, res) {
    res.render("playground", {
         playground: true, 
         title: "Try free jsreport online playground",
         description: "Try free jsreport online fiddling tool. Share your reports with others. Embed report generation into your website."
    });
};

exports.buy = function(req, res) {
    res.render("buy", {
        buy: true,
        title: "jsreport - buy",
        description: "Buy on premise jsreport"
    });
};

exports.online = function(req, res) {
    res.render("online", { 
        online: true, 
        title: "jsreportonline - pdf reports as a service",
        description: "Do not install anything. Just register to cloud based jsreportonline service and start creating reports now."
    });
};

exports.onlinePricing = function(req, res) {
    res.render("online-pricing", {
        online: true,
        title: "jsreportonline - pdf reports as a service",
        description: "Do not install anything. Just register to cloud based jsreportonline service and start creating reports now."
    });
};

exports.about = function(req, res) {
    res.render("about", { about: true, title: "About jsreport"});
};

exports.downloads = function(req, res) {
    res.render("downloads", { onprem: true, title: "Download jsreport on-prem" });
};

exports.embedding = function(req, res) {
    res.render("embedding",  { playground: true, title: "Embed jsreport to any page" });
};