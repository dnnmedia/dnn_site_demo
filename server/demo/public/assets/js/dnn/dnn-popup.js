var DNN = typeof DNN === "object" ? DNN : {};

/*
|--------------------------------------------------------------------------
| Popup
|--------------------------------------------------------------------------
|
| General purpose popups
|
*/
DNN.popups = {};

DNN.popups.Popup = (function() {

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

  var customPopups = [
      "feedback",
      "etheraccounts",
      "uploader",
      "uploader-local",
      "source",
      "link"
  ];

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
                <strong>'+DNN.Session.current.name+'</strong>\
                <span>[Reviewer]</span>\
           </div>'));

           $content.append($('<textarea name="feedback" placeholder="Type your feedback for the writer..."></textarea>'))

           DNN.Request.get("/api/v1/media/"+DNN.Session.current.photo)
            .then(function(data) {
                  if (data) $content.find(".image").css("background-image", "url("+data+")");
            });

           if (this.buttons.length > 0) {
             var $buttons = $('<div class="popup-buttons"></div>');
             for (var index in this.buttons) {
                $buttons.append($('<a href="javascript:void(0);" class="btn" data-button="'+index+'">'+this.buttons[index]+'</a>'))
             }
             $content.append($buttons);
             $content.on("click", ".btn", function() {
               that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {data: that.data(), button:$(this).data("button")} }));
               that.$markup.get(0).dispatchEvent(new CustomEvent('data', {detail: that.data() }));
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
                that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {data: that.data(), button:$(this).data("button")} }));
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
                that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {data: that.data(), button:$(this).data("button")} }));
                if (!that.preventHide) that.hide();
             });
          }

           return $markup;
      }
      else if (this.type === "uploader-local") {
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
             if (typeof LI === "object") {
                DNN.Request.post("/api/v1/media/add", {media:fileData})
                  .then(function(result) {
                      that.$markup.get(0).dispatchEvent(new CustomEvent('uploaded', {detail: result}));
                  })
                  .fail(console.log);
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
                that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {data: that.data(), button:$(this).data("button")} }));
                if (!that.preventHide) that.hide();
             });
          }

           return $markup;
      }
      else if (this.type === "source") {
            var $markup = $('<div class="popup hide" data-type= "'+this.type+'" id="'+this.id+'">\
                  <div class="popup-overlay"></div>\
                  <div class="popup-content">\
                  </div>\
              </div>');

           var $content = $markup.find(".popup-content");

           $content.append($('<textarea name="source" placeholder="Type your source..."></textarea>'))

           if (this.buttons.length > 0) {
             var $buttons = $('<div class="popup-buttons"></div>');
             for (var index in this.buttons) {
                $buttons.append($('<a href="javascript:void(0);" class="btn" data-button="'+index+'">'+this.buttons[index]+'</a>'))
             }
             $content.append($buttons);
             $content.on("click", ".btn", function() {
                that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {data: that.data(), button: $(this).data("button")} }));
                that.$markup.get(0).dispatchEvent(new CustomEvent('data', {detail: that.data() }));
                if (!that.preventHide) that.hide();
             });
           }

           return $markup;
      }
      else if (this.type === "link") {
            var $markup = $('<div class="popup hide" data-type= "'+this.type+'" id="'+this.id+'">\
                  <div class="popup-overlay"></div>\
                  <div class="popup-content">\
                  </div>\
              </div>');

           var $content = $markup.find(".popup-content");

           $content.append($('<textarea name="link" placeholder="Link to site..."></textarea>'))

           if (this.buttons.length > 0) {
             var $buttons = $('<div class="popup-buttons"></div>');
             for (var index in this.buttons) {
                $buttons.append($('<a href="javascript:void(0);" class="btn" data-button="'+index+'">'+this.buttons[index]+'</a>'))
             }
             $content.append($buttons);
             $content.on("click", ".btn", function() {
                that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {data: that.data(), button: $(this).data("button")} }));
                that.$markup.get(0).dispatchEvent(new CustomEvent('data', {detail: that.data() }));
                if (!that.preventHide) that.hide();
             });
           }

           return $markup;
      }

  };

  Popup.prototype.construct = function() {
    var that = this;
    if (customPopups.indexOf(this.type) != -1) return this.customConstruct();
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
              that.$markup.get(0).dispatchEvent(new CustomEvent('button', {detail: {data: that.data(), button: $(this).data("button") } }));
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

      return this;
  };

  Popup.prototype.hide = function() {
      var that = this;
      this.$markup.attr("class", "popup hide");
      setTimeout(function() {
          that.$markup.get(0).dispatchEvent(new Event('hide'));
      },500);

      return this;
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

    return this;
  };

  Popup.prototype.data = function() {
      var data = {};
      if (this.type === "feedback") {
          data["feedback"] = this.$markup.find("textarea[name='feedback']").val() || ""
      }
      else if (this.type === "source") {
          data["source"] = this.$markup.find("textarea[name='source']").val() || ""
      }
      else if (this.type === "link") {
          data["link"] = this.$markup.find("textarea[name='link']").val() || ""
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
      else if (this.type === "source") {
          this.$markup.find("textarea[name='source']").val("")
      }
      else if (this.type === "link") {
          this.$markup.find("textarea[name='link']").val("")
      }
      return this;
  };

  return Popup;
})();

/*
|--------------------------------------------------------------------------
| Popup
|--------------------------------------------------------------------------
|
| Popups used often can be defined here under an useful alias.
|
*/
DNN.popups.Notice = function(message) {
  var popup = new DNN.popups.Popup("notice","", message, ["Close"]);
  return popup;
};

DNN.popups.UploaderLocal = function() {
    var popup = new DNN.popups.Popup("uploader-local", "", "", ["Done"]);
    return popup;
};

DNN.popups.Source = function() {
    var popup = new DNN.popups.Popup("source", "", "", ["Cancel", "Add Source"]);
    return popup;
};

DNN.popups.Link = function() {
    var popup = new DNN.popups.Popup("link", "", "", ["Cancel", "Add Link"]);
    return popup;
};

DNN.popups.Feedback = function() {
  var popup = new DNN.popups.Popup("feedback", "", "", ["Cancel", "Save"])
  return popup
};

DNN.popups.ReviewPolicy = function() {
    var popup = new DNN.popups.Popup("notice", "", "Carefully read over this piece and ensure it follows <a href='/guidelines' target='_blank'>DNN's Content Guidelines and policies</a>.", ["Start"], "/assets/img/document.png")
    return popup;
};

DNN.popups.RemoveConfirmation = function(message) {
  var popup = new DNN.popups.Popup("warning", "", message, ["No", "Yes"], "/assets/img/articles-trash-big.png")
  return popup;
};

DNN.popups.ArticleSubmitted = function() {
    var popup = new DNN.popups.Popup("success","","Your article has been successfully submitted for review!",["Done"], "/assets/img/articles-checkmark.png");
    return popup;
};

DNN.popups.ArticleReviewed = function() {
    var popup = new DNN.popups.Popup("success","","Your review has successfully been submitted!",["Done"], "/assets/img/articles-checkmark.png");
    return popup;
};

DNN.popups.ArticleSubmitConfirmation = function() {
    var popup = new DNN.popups.Popup("message","","Are you sure you want to submit this article for review?",["Cancel", "Submit"], "/assets/img/articles-clipboard.png");
    return popup;
};

DNN.popups.ArticleReviewConfirmation = function() {
    var popup = new DNN.popups.Popup("message", "", "Do you want to begin review this article?", ["Cancel", "Review"], "/assets/img/articles-clipboard.png");
    return popup;
};
