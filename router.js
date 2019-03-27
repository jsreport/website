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

exports.buyOnPrem = function(req, res) {
    res.render("buy", {
        buy: true,
        buyOnPrem: true,
        title: "jsreport - buy",
        description: "Buy jsreport license"
    });
};

exports.buySupport = function(req, res) {
  res.render("buy", {
    buy: true,
    buySupport: true,
    title: "jsreport - buy",
    description: "Buy jsreport support"
  });
};

exports.buyOnline = function(req, res) {
  res.render("buy", {
    buy: true,
    buyOnline: true,
    title: "jsreport - buy",
    description: "Buy jsreport online credits"
  });
};

exports.buyThankYou = function(req, res) {
  res.render("thank-you", {
    buy: true,
    title: "jsreport - buy",
    description: "Thank you"
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
    res.redirect("/on-prem")
};

exports.embedding = function(req, res) {
    res.render("embedding",  { playground: true, title: "Embed jsreport to any page" });
};

exports.showcases = function(req, res) {
  res.render("showcases", {     
       title: "jsreport - showcases",
       description: "jsreport showcases"
  });
};

exports.contactEmail = (db) => (req, res) => {  
  db().collection('contacts').insertOne({
    date: new Date(),
    email: req.body.contactEmail,    
    enabledNewsletter: req.body.enabledNewsletter === 'true',
    type: req.body.type  
  }).then(() => {
    // expire in 30seconds
    res.cookie('jsreport-contact-email-set', 'true',  { maxAge: 30 * 60 * 1000 })
    res.send('ok')
  }).catch((e) => {
    console.error(e)
    res.send('error ' + e)
  })  
}