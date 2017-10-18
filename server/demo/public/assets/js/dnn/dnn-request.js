var DNN = typeof DNN === "object" ? DNN : {};

/*
|--------------------------------------------------------------------------
| Request Wrapper
|--------------------------------------------------------------------------
|
| Used to send HTTP requests
|
*/
DNN.Request = (function() {
    var request = {};
    request.get = $.get
    request.post = $.post
    request.ajax = $.ajax
    return request;
})();
