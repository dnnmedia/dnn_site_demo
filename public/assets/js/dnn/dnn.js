var DNN = {};


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
| Constants
|--------------------------------------------------------------------------
|
| App constants
|
*/
DNN.constants = {};
DNN.constants.token = {
    name: "DNN",
    symbol: "DNN",
    denomination: 1000,
    faucetaddress: "0x4cc65D82d4d66b1305EAaA2a62909bd07833f85E"
};


/*
|--------------------------------------------------------------------------
| Popup
|--------------------------------------------------------------------------
|
| General purpose popups
|
*/
DNN.popup = (function() {
  var Popup = function(type,title,text,buttons,icon) {
      var that = this;
      this.type = type || ""
      this.id = type || ""
      this.title = title || ""
      this.text = text || ""
      this.buttons = buttons || []
      this.icon = icon || ""
      this.$markup = this.construct();
      $("body").append(this.$markup);
      this.$markup.on("click", ".popup-overlay", function() {
          if (!that.preventHide) that.hide();
      });
  };

  Popup.prototype.$markup = null;
  Popup.prototype.id= null;
  Popup.prototype.type = null;
  Popup.prototype.title = null;
  Popup.prototype.text= null;
  Popup.prototype.buttons= null;
  Popup.prototype.icon = null;
  Popup.prototype.preventHide = false
  Popup.prototype.on = function(eventName, eventHandler) {
      if (typeof eventName === "string" && typeof eventHandler === "function") {
          this.$markup.get(0).addEventListener(eventName, eventHandler);
      }
  };

  Popup.prototype.customConstruct = function() {
      var that = this;
      if (this.type === "feedback") {
            var $markup = $('<div class="popup hide" data-type= "'+this.type+'" id="'+this.id+'">\
                  <div class="popup-overlay"></div>\
                  <div class="popup-content">\
                  </div>\
              </div>');

           var $content = $markup.find(".popup-content");

           $content.append($('<div class="popup-user">\
                <div class="image"></div>\
                <strong>'+DNN.User.session.user.fullname+'</strong>\
                <span>[Reviewer]</span>\
           </div>'));

           $content.append($('<textarea name="feedback" placeholder="Type your feedback for the writer..."></textarea>'))

           DNN.Request.get(IPFS.config.gateway+DNN.User.session.user.photo)
            .then(function(data) {
                $content.find(".image").css("background-image", "url("+data+")");
            });

           if (this.buttons.length > 0) {
             var $buttons = $('<div class="popup-buttons"></div>');
             for (var index in this.buttons) {
                $buttons.append($('<a href="javascript:void(0);" class="btn" data-button="'+index+'">'+this.buttons[index]+'</a>'))
             }
             $content.append($buttons);
             $content.on("click", ".btn", function() {
               that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {button:$(this).data("button")} }));
               that.$markup.get(0).dispatchEvent(new CustomEvent('data', {detail: {feedback: $content.find("textarea").val() } }));
                if (!that.preventHide) that.hide();
             });
           }

           return $markup;
      }
      else if (this.type === "etheraccounts") {
            var $markup = $('<div class="popup hide" data-type= "'+this.type+'" id="'+this.id+'">\
                  <div class="popup-overlay"></div>\
                  <div class="popup-content">\
                  </div>\
              </div>');

           var $content = $markup.find(".popup-content");

           var $text = $("<p></p>");
           $content.append($text);

           var $accounts = $("<div class='ethereum-accounts'></div>");
           $content.append($accounts);

           if (this.buttons.length > 0) {
             var $buttons = $('<div class="popup-buttons"></div>');
             for (var index in this.buttons) {
                $buttons.append($('<a href="javascript:void(0);" class="btn" data-button="'+index+'">'+this.buttons[index]+'</a>'))
             }
             $content.append($buttons);
             $content.on("click", ".btn", function() {
                that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {button:$(this).data("button")} }));
                if (!that.preventHide) that.hide();
             });
           }

           return $markup;
      }
      else if (this.type === "uploader") {
            var $markup = $('<div class="popup hide" data-type= "'+this.type+'" id="'+this.id+'">\
                  <div class="popup-overlay"></div>\
                  <div class="popup-content">\
                  </div>\
              </div>');

           var $content = $markup.find(".popup-content");

           var $text = $("<p>To add a photo, drag and drop your file below.</p>");
           $content.append($text);

           var $droparea = $('<div class="droparea"><p><strong>Drag and Drop</strong><small>(Supported: PNG, JPG, GIF, BMP)</small></p></div>');
           $content.append($droparea);

           var saveFile = function(fileName, fileData) {
             if (typeof IPFS === "object" && typeof LI === "object") {
                IPFS.store(fileData)
                  .then(function(result) {
                      that.$markup.get(0).dispatchEvent(new CustomEvent('uploaded', {detail: {files: result.files}}));
                  })
                  .catch(console.log);
             }
           };

          var dataUriToBuffer = require('data-uri-to-buffer');
 					var dropper = $droparea.get(0) || {};

 					dropper.ondragenter = function (e)
 					{
 							dropper.className = 'droparea hover';
 							e.preventDefault();
 					};

 					dropper.ondragover = function (e)
 					{
              dropper.className = 'droparea over';
 							e.preventDefault();
 					};

 					dropper.ondragleave = function (e)
 					{
 							dropper.className = 'droparea leave';
 							e.preventDefault();
 					};

 					dropper.ondrop = function (e)
 					{
              var files = [].slice.call(e.dataTransfer.files);
 							files.forEach(function (file) {
 									var reader = new FileReader();
 									reader.onload = function (event) {
                      that.hide();
                      saveFile(file.name, event.target.result);
 									};
 									reader.readAsDataURL(file);
 							});
 							dropper.className = 'droparea';
 							e.preventDefault();
 					};


          if (this.buttons.length > 0) {
             var $buttons = $('<div class="popup-buttons"></div>');
             for (var index in this.buttons) {
                $buttons.append($('<a href="javascript:void(0);" class="btn" data-button="'+index+'">'+this.buttons[index]+'</a>'))
             }
             $content.append($buttons);
             $content.on("click", ".btn", function() {
                that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {button:$(this).data("button")} }));
                if (!that.preventHide) that.hide();
             });
          }

           return $markup;
      }
  };

  Popup.prototype.construct = function() {
    var that = this;
    if (["feedback","etheraccounts", "uploader"].indexOf(this.type) != -1) return this.customConstruct();
    else {
        var $markup = $('<div class="popup hide" data-type= "'+this.type+'" id="'+this.id+'">\
              <div class="popup-overlay"></div>\
              <div class="popup-content">\
              </div>\
          </div>');

      var $content = $markup.find(".popup-content");

      if (this.icon != "") {
         var $icon = $('<div class="popup-icon" style="background-image:url('+this.icon+')"></div>');
         $content.append($icon);
      }

      if (this.title != "") {
         var $title = $("<h3>"+this.title+"</h3>");
         $content.append($title);
      }

       if (this.text != "") {
          var $text = $("<p>"+this.text+"</p>");
          $content.append($text);
       }

       if (this.buttons.length > 0) {
         var $buttons = $('<div class="popup-buttons"></div>');
         for (var index in this.buttons) {
            $buttons.append($('<a href="javascript:void(0);" class="btn" data-button="'+index+'">'+this.buttons[index]+'</a>'))
         }
         $content.append($buttons);
         $content.on("click", ".btn", function() {
              that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {button:$(this).data("button")} }));
              if (!that.preventHide) that.hide();
         });
       }

       return $markup;
     }
  };

  Popup.prototype.show = function() {
      var that = this;
      this.update();
      setTimeout(function() {
          that.$markup.attr("class", "popup show");
          setTimeout(function() {
              that.$markup.get(0).dispatchEvent(new Event('show'));
          },500);
      },100);
  };

  Popup.prototype.hide = function() {
      var that = this;
      this.$markup.attr("class", "popup hide");
      setTimeout(function() {
          that.$markup.get(0).dispatchEvent(new Event('hide'));
      },500);
  };

  Popup.prototype.update = function() {
    var that = this;
    if (this.type === "etheraccounts") {
        if (typeof backend === "object") {
           backend.eth.accounts()
             .then(function(accounts) {
                 that.$markup.find(".ethereum-accounts").html("");
                 if (accounts.length > 0) {
                     that.$markup.find("p").html("Which ethereum account would you like DNN to use?");
                     that.$markup.find("a").removeClass("disabled");
                     for (var index in accounts) {
                         backend.contracts.DNNTokenContract.balanceOf(accounts[index])
                             .then(function(result) {
                                   that.$markup.find(".ethereum-accounts").append($("<div class='ethereum-account'><input type='radio' name='etheraccount' value='"+accounts[index]+"'><div><strong>"+accounts[index]+"</strong><br><span>Balance: "+parseInt(result.balance.toString())/DNN.constants.token.denomination+" DNN</span></div></div>"));
                             });
                     }
                 }
                 else {
                     that.$markup.find("p").html("No ethereum accounts were found. Please make sure that your account is unlocked.");
                     that.$markup.find("a").addClass("disabled");
                    }
             })
             .catch(console.log);
        }
    }
  };

  Popup.prototype.data = function() {
      var data = {};
      if (this.type === "feedback") {
          data["feedback"] = this.$markup.find("textarea[name='feedback']").val() || ""
      }
      else if (this.type === "etheraccounts") {
          data["account"] = this.$markup.find("input[name='etheraccount']:checked").val()  || ""
      }
      return data;
  };

  Popup.prototype.clear = function() {
      if (this.type === "feedback") {
          this.$markup.find("textarea[name='feedback']").val("")
      }
  };

  return Popup;
})();



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
    return request;
})();


/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
|
| Handles session user
|
*/
DNN.User = {};

DNN.User.session = null;

DNN.User.Types = {
  Any: -1,
  None: 0,
  Reader: 1,
  Reviewer: 2,
  Writer: 3
};

DNN.User.updateData = function(data, account) {
  return new Promise(function(resolve, reject) {
        LI.show()
        IPFS.store(data)
          .then(function(res) {
                backend.contracts.UserContract.updateUserData(res.files[0].hash, {from:account})
                    .then(function(userTx) {
                          LI.hide();
                          DNN.User.session = data;
                          resolve({userTx:userTx});
                    })
                    .catch(function(err) {
                          LI.hide();
                          reject({error: err});
                    })

          })
          .catch(function(err) {
              LI.hide();
              reject({error: err});
          });
    });
};

DNN.User.updateType = function(type, account) {
    return new Promise(function(resolve, reject) {
        LI.show();
        backend.contracts.UserContract.updateUserType(type, {from: account})
              .then(function(userTx) {
                    LI.hide();
                    resolve({error: false, userTx:userTx});
              })
              .catch(function(err) {
                    LI.hide();
                    resolve({error: err});
              })
    });
};

DNN.User.clearCache = function() {
  localStorage.removeItem("account");
  this.session = null;
};

DNN.User.showEthAccounts = function() {
  var popup = new DNN.popup("etheraccounts", "", "", ["Refresh", "Done"]);
  popup.preventHide = true
  popup.on("button", function(event) {
        if (event.detail.button === 0) popup.update();
        else if (event.detail.button === 1 && popup.data().account) {
            localStorage.setItem("account", popup.data().account);
            window.location.reload();
        }
  });
  popup.show();
};

DNN.User.handle = function(expectedUserType, preventAccountPopup, preventOnboardRedirect, preventTypeRedirect) {
  var that = this;
  return new Promise(function(resolve, reject) {
        if (typeof LI === "object") LI.show();
        if (DNN.User.isCached()) {
            backend.eth.accounts()
              .then(function(accounts) {
                  if (accounts.length === 0 || accounts[0] != localStorage.getItem("account")) {
                      if (typeof LI === "object") LI.hide();
                      if (!preventAccountPopup) DNN.User.showEthAccounts();
                      else resolve(null);
                  }
                  else {
                    DNN.User.get().then(function(data) {
                        if (data.exists) {
                           if (expectedUserType != DNN.User.Types.Any && data.userType != expectedUserType) {
                                if (typeof LI === "object") LI.hide();
                                if (!preventTypeRedirect) window.location.href = "/type"
                                else resolve(null);
                           }
                           else {
                             if (typeof LI === "object") LI.hide();
                             that.session = data;
                             resolve(data)
                           }
                        }
                        else {
                            if (typeof LI === "object") LI.hide();
                            if (!preventOnboardRedirect) window.location.href = "/onboard";
                            else resolve(null);
                        }
                    });
                  }
              })
              .catch(function() {
                 if (typeof LI === "object") LI.hide();
                 resolve(null)
              })
        }
        else {
          if (typeof LI === "object") LI.hide();
          if (!preventAccountPopup) DNN.User.showEthAccounts();
          else resolve(null);
        }
  });
};

DNN.User.isCached = function() {
   return !(localStorage.getItem("account") === null)
};

DNN.User.get = function(account) {
  var ethaccount = localStorage.getItem("account") || account;
  return new Promise(function(resolve, reject) {
      if (typeof backend === "object") {
          backend.contracts.UserContract.retrieveUserData(ethaccount)
          	.then(function(userHash) {
                if (userHash[0] != "") {
                    DNN.Request.get(IPFS.config.gateway+userHash[0])
                      .then(function(userData) {
                          if (userData) {
                              backend.contracts.UserContract.retrieveUserType(ethaccount)
                                .then(function(userType) {
                                    backend.contracts.DNNTokenContract.balanceOf(ethaccount)
                                      .then(function(result) {
                                          resolve({balance: (parseInt(result[0].toString())/DNN.constants.token.denomination), account: ethaccount, user: JSON.parse(userData), userType:parseInt(userType[0].toString()), exists: true});
                                      })
                                      .catch(function() {
                                        resolve({balance: 0, account: ethaccount, user: JSON.parse(userData), userType:parseInt(userType[0].toString()), exists: true});
                                    })

                                })
                                .catch(function() {
                                      resolve({balance: 0, account: ethaccount, user: JSON.parse(userData), userType: DNN.User.Types.None, exists: true});
                                });
                          }
                          else resolve({exists: false});
                      });
                  }
                  else resolve({exists:false});

            })
          	.catch(function() {
                resolve({exists:false});
            });
      }
  });
};

DNN.User.getAssignedArticles = function() {
    return MockData.assignedArticles;
    //return JSON.parse((localStorage.getItem("articles_assigned") || "[]"))
};

DNN.User.getSubmittedArticles = function() {
    return JSON.parse((localStorage.getItem("articles_submitted") || "[]"))
};

DNN.User.getDraftArticles = function() {
    return JSON.parse((localStorage.getItem("articles_drafted") || "[]"))
};

DNN.User.getReadArticles = function() {
    return JSON.parse((localStorage.getItem("articles_read") || "[]"))
};

DNN.User.getReviewedArticles = function() {
    return JSON.parse((localStorage.getItem("articles_reviewed") || "[]"))
};

DNN.User.removeArticleRead = function(id) {
  var articles = JSON.parse((localStorage.getItem("articles_read") || "[]"))
  var remove = -1;
  for (var index in articles) {
    if (articles[index].id === id) {
       remove = index;
    }
  }
  if (remove != -1) articles.splice(remove, 1);
  localStorage.setItem("articles_read", JSON.stringify(articles));
};


/*
|--------------------------------------------------------------------------
| Article
|--------------------------------------------------------------------------
|
| Handles article
|
*/
DNN.Article = {};

DNN.Article.submit = function(article, account) {
  return new Promise(function(resolve, reject) {
      LI.show();
      IPFS.store(article)
      	.then(function(result) {
               LI.hide();
               var articleHash = result.files[0].hash
               var popup = new DNN.popup("message", "", "Your approval is needed to submit this article. To finalize the submission, accept the following two transactions to send your article into review.", ["Cancel", "Continue"])
               popup.on("button", function(event) {
                  if (event.detail.button === 1) {
                       LI.show();
                       backend.contracts.DNNTokenContract.approve(backend.contracts.ReviewProcessContractAddress, 100 * DNN.constants.token.denomination, {from: account})
                          .then(function(approveTx) {
                              backend.contracts.ReviewProcessContract.submitArticleForReview(articleHash, {from: account})
                                  .then(function(reviewTx) {
                                      LI.hide();
                                      resolve({approveTx:approveTx, reviewTx:reviewTx, article: articleHash})
                                  })
                                  .catch(function(err) {
                                      LI.hide();
                                      reject({error:err});
                                  })

                          })
                          .catch(function(err) {
                              LI.hide();
                              reject({error:err});
                          });
                    }
              });
              popup.show();
        })
      	.catch(function(err) {
            LI.hide();
            reject({error:err});
        });

    });
};

DNN.Article.get = function(articleHash) {
    return new Promise(function(resolve, reject) {
        DNN.Request.get(IPFS.config.gateway + articleHash)
          .then(function(data) {
              resolve(JSON.parse(data));
          })
          .fail(reject)
    });
};

DNN.Article.read = function(article, id) {
  var hasRead = false
  var articles = JSON.parse((localStorage.getItem("articles_read") || "[]"))
  for (var index in articles) {
      if (articles[index].id === id) {
          hasRead = true
      }
  }
  if (!hasRead) articles.push({id:id, article: article});
  localStorage.setItem("articles_read", JSON.stringify(articles));
};

DNN.Article.submitReview = function(articleHash, personalVote, peerVote, feedback, account) {
  return new Promise(function(resolve, reject) {
      LI.show();
      IPFS.store({article:articleHash, feedback:feedback, user:DNN.User.session.user, created: (new Date()).toString()})
        .then(function(result) {
            var feedbackHash = result.files[0].hash;
            var _personalVote = personalVote ? "1" : "2";
            var _peerVote = peerVote ? "1" : "2";
            LI.hide();
            resolve({feedbackHash: feedbackHash});

              // backend.contracts.ReviewProcessContract.vote(articleHash, _personalVote, _peerVote, feedbackHash, {from: account})
              //   .then(function(reviewTx) {
              //       LI.hide();
              //       console.log(reviewTx);
              //   })
              //   .catch(function() {
              //       console.log(arguments);
              //       LI.hide();
              //       reject();
              //   });

        })
        .catch(function() {
          LI.hide();
          reject();
        });
  });
};

/*
|--------------------------------------------------------------------------
| Article
|--------------------------------------------------------------------------
|
| Handles article
|
*/
DNN.Editor = {};

DNN.Editor.handleArticleLoad = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        var id = window.location.href.split("/").reverse()[0] || "";
        id = id === "editor" ? "" : id;
        resolve(that.getArticleDraft(id));
    });
};

DNN.Editor.getArticleDraft = function(id) {
  var articles = JSON.parse((localStorage.getItem("articles_drafted") || "[]"))
  for (var index in articles) {
    if (articles[index].id === id) {
       return articles[index];
    }
  }
  return null;
};

DNN.Editor.removeArticleDraft = function(id) {
  var articles = JSON.parse((localStorage.getItem("articles_drafted") || "[]"))
  var remove = -1;
  for (var index in articles) {
    if (articles[index].id === id) {
       remove = index;
    }
  }
  if (remove != -1) articles.splice(remove, 1);
  localStorage.setItem("articles_drafted", JSON.stringify(articles));
};

DNN.Editor.storeArticleAsDraft = function(article, id) {
   var updated = false;
   var articles = JSON.parse((localStorage.getItem("articles_drafted") || "[]"))
   for (var index in articles) {
     if (articles[index].id === id) {
        updated = true;
        articles[index].article = article;
        articles[index].updated = (new Date()).toString();
     }
   }
   if (!updated) articles.push({id:id, article: article, updated: (new Date()).toString()});
   localStorage.setItem("articles_drafted", JSON.stringify(articles));
};

DNN.Editor.storeArticleAsSubmitted = function(article, ipfsID) {
   var articles = JSON.parse((localStorage.getItem("articles_submitted") || "[]"))
   articles.push({id: ipfsID, article: article});
   localStorage.setItem("articles_submitted", JSON.stringify(articles));
};

DNN.Editor.storeArticleAsReviewed = function(article, ipfsID, feedbackIpfsID) {
   var articles = JSON.parse((localStorage.getItem("articles_reviewed") || "[]"))
   articles.push({id: ipfsID, article: article, feedback: feedbackIpfsID});
   localStorage.setItem("articles_reviewed", JSON.stringify(articles));
};
