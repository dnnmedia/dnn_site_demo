(function( $ ) {
  "use strict"

  if (typeof $ === "function") {
      $(document).on("ready", function() {

          // Autoresize Textareas
          //var $autoresizeElements = $("*[autoresize]");
          //$autoresizeElements.on("input", function() {
          //    var outerHeightPrevious = $(this).outerHeight();
          //    $(this).outerHeight(38).outerHeight(this.scrollHeight);
          //    if (outerHeightPrevious != $(this).outerHeight()) {
          //        window.scrollTo(0,document.body.scrollHeight);
          //    }
         //});

          // Menu
          var $user = $("#user");
          var $userMenu = $("#user-menu");
          $user.on("click", function() {
              if ($userMenu.hasClass("open")) {
                $userMenu.attr("class", "closed");
              }
              else {
                $userMenu.attr("class", "open");
              }
          });

          // dropdown
          var $dropdown = $(".dropdown");
          $dropdown.on("click", ".selected", function() {
              var $parent = $(this).parent();
              var $values = $parent.find(".values");
              if ($parent.hasClass("open")) {
                $parent.removeClass("open");
              }
              else {
                $parent.addClass("open");
              }
          })
          $dropdown.on("click", ".values > .value", function() {
             var $parent = $(this).parent().parent();
             var $selected = $parent.find(".selected");
             var value = $(this).find("span").eq(1).text();

             if ($parent.hasClass("open")) {
               $parent.removeClass("open");
             }
             else {
               $parent.addClass("open");
             }

              $selected.find("span").eq(1).html(value);
           })

           // Loading Indicator
          var LI = {};
          LI.$holder = $("body");
          LI.selector = "loading-indicator"
          LI.show = function() {
              var $loader = $('<div id="'+this.selector+'"><img src="/assets/img/loading-indicator.gif" /></div>');
              this.$holder.append($loader);
              setTimeout(function() {
                $loader.addClass("show");
              });
          };
          LI.hide = function() {
              var that = this;
              $("#" + this.selector).removeClass("show");
              setTimeout(function() {
                  $("#" + that.selector).remove();
              },500);
          };
          window.LI = LI


      });
  }

})( jQuery )
