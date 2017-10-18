var DNN = typeof DNN === "object" ? DNN : {};

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
|
| Handles session user
|
*/
DNN.User = {};

DNN.User.getArticleFeed = function() {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    return DNN.Request.post("/api/v1/articles", payload)
};

DNN.User.getAssignedArticles = function() {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    return DNN.Request.post("/api/v1/assigned/articles", payload)
};

DNN.User.getSubmittedArticles = function() {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    return DNN.Request.post("/api/v1/submitted/articles", payload)
};

DNN.User.getDraftArticles = function() {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    return DNN.Request.post("/api/v1/drafted/articles", payload)
};

DNN.User.getReadArticles = function() {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    return DNN.Request.post("/api/v1/read/articles", payload)
};

DNN.User.getReviewedArticles = function() {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    return DNN.Request.post("/api/v1/reviewed/articles", payload)
};

DNN.User.removeRead = function(slug) {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    payload.slug = slug || ""
    return DNN.Request.post("/api/v1/read/article/remove", payload)
};

DNN.User.saveRead = function(slug, article) {
     var payload = DNN.Session.current || {}
     payload.userid = payload._id || ""
     payload.article = article
     payload.slug = slug
     return DNN.Request.post("/api/v1/read/article", payload)
};
