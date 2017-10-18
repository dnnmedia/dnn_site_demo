var DNN = typeof DNN === "object" ? DNN : {};

/*
|--------------------------------------------------------------------------
| Article
|--------------------------------------------------------------------------
|
| Handles article
|
*/
DNN.Editor = {};

DNN.Editor.getDraft = function(slug) {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    payload.slug = slug
    return DNN.Request.post("/api/v1/draft/article/find", payload)
};


DNN.Editor.removeDraft = function(slug, article) {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    payload.article = article
    payload.slug = slug
    return DNN.Request.post("/api/v1/draft/article/remove", payload)
};

DNN.Editor.saveDraft = function(slug, article) {
     var payload = DNN.Session.current || {}
     payload.userid = payload._id || ""
     payload.article = article
     payload.slug = slug
     return DNN.Request.post("/api/v1/draft/article", payload)
};

DNN.Editor.submitArticle = function(article) {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    payload.article = article
    return DNN.Request.post("/api/v1/submit/article", payload)
};

DNN.Editor.reviewArticle = function(slug, article, review) {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    payload.article = article
    payload.slug = slug
    payload.review = review
    return DNN.Request.post("/api/v1/review/article", payload)
};
