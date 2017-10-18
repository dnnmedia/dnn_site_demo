var DNN = typeof DNN === "object" ? DNN : {};

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
|
| Handles sessions
|
*/
DNN.Session = {};

DNN.Session.current = null;

DNN.Session.get = function() {
     return new Promise(function(resolve, reject) {
        var user = JSON.parse((localStorage.getItem("user") || "{}"))
        if (Object.keys(user).length > 0) {
            DNN.Request.post("/api/v1/user/verify", user)
                .then(function(data) {
                    if (data.valid) {
                        DNN.Session.current = data.user
                        DNN.Session.save(user);
                        resolve(user)
                    }
                    else reject();
                })
                .fail(function()  {
                    reject();
                })
        }
        else {
          reject();
        }
     });
};

DNN.Session.save = function(user) {
   if (user) localStorage.setItem("user", JSON.stringify(user));
};

DNN.Session.update = function(user) {
    return DNN.Request.post("/api/v1/user/update", this.current);
};

DNN.Session.destroy = function() {
    localStorage.removeItem("user");
};
