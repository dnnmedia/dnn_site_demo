var DNN = typeof DNN === "object" ? DNN : {};

/*
|--------------------------------------------------------------------------
| ID Generator
|--------------------------------------------------------------------------
|
| Generates a unique ID
|
*/
DNN.generateID = function() {
    return Math.random().toString(36).substr(2, 9) + Date.now();
};

/*
|--------------------------------------------------------------------------
| Redirect
|--------------------------------------------------------------------------
|
| Carries out page redirect
|
*/
DNN.Redirect = function(url, newTab) {
    if (newTab) window.open(url, "_blank");
    else window.location.href = url
};
