var DNN = typeof DNN === "object" ? DNN : {};

/*
|--------------------------------------------------------------------------
| Article
|--------------------------------------------------------------------------
|
| Handles article
|
*/
DNN.Article = {};

DNN.Article.get = function(slug) {
    var payload = DNN.Session.current || {}
    payload.userid = payload._id || ""
    payload.slug = slug
    return DNN.Request.post("/api/v1/article/find", payload)
};
