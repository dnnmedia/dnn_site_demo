'use strict';

// Declare app level module which depends on views, and components
angular.module('DNN', [
  'ngRoute'
])
.config(['$locationProvider', '$routeProvider', '$interpolateProvider', function($locationProvider, $routeProvider, $interpolateProvider) {
        $locationProvider.hashPrefix('!');
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
}])

.directive('countrydropdown', ['$timeout', function($timeout) {
    return {
      scope: {},
      restrict: "E",
      replace: true,
      template: '<div class="dropdown" style="display:none;">\
          <div class="selected value">\
              <span class="value-picture"></span>\
              <span class="value-name">US</span>\
              <span class="arrow"></span>\
          </div>\
          <div class="values">\
              <div class="value">\
                  <span class="value-picture"></span>\
                  <span class="value-name">US</span>\
              </div>\
                  <div class="value">\
                      <span class="value-picture"></span>\
                      <span class="value-name">UK</span>\
                  </div>\
          </div>\
      </div>'
    }
}])

.directive('mediabackground', ["$timeout", function ($timeout) {
    return {
        scope: {
          hash: "=",
          type:"@"
        },
        restrict: "E",
        replace: true,
        template: '<div class="image" style="" ></div>',
        link: function(scope, element, attrs) {
          if (typeof DNN === "object"  && typeof IPFS === "object" && scope.hash) {
              scope.$watch("hash", function() {
                  DNN.Request.get(IPFS.config.gateway + scope.hash).then(function(data) {
                      $timeout(function() {
                        element.attr("style", "background-image: url("+data.replace(/"/g, "")+")" );
                      })
                    })
              });
          }
        }
    };
}])

.directive('media', ["$timeout", function ($timeout) {
    return {
        scope: {
          hash: "=",
          type:"@"
        },
        restrict: "E",
        replace: true,
        template: '<img class="image" src=\'\' />',
        link: function(scope, element, attrs) {
          if (typeof DNN === "object"  && typeof IPFS === "object" && scope.hash) {
              DNN.Request.get(IPFS.config.gateway + scope.hash).then(function(data) {
                  $timeout(function() {
                      element.attr("src", data.replace(/"/g, ""));
                  })
              })
              scope.$on("hash", function()  {
                scope.render();
              })
          }
        }
    };
}])

.directive('editor', ["$timeout", function ($timeout) {
    return {
        scope: {
          text: "=",
          textmarkup:"=",
          placeholder:"@"
        },
        restrict: "E",
        replace: true,
        template: '<div class="content-editor">\
                        <div class="editable-content"></div>\
                        <div class="placeholder" ng-show="!text || text.length === 0">[[placeholder]]</div>\
                   </div>',
        link: function(scope, element, attrs) {

            scope.$watch("textmarkup", function(n, o) {
                if (o == undefined) element.find(".editable-content").html(scope.textmarkup);
            });

            if (typeof Aloha === "object") {
              Aloha.ready( function() {
                    var $editableContent = $(element).find(".editable-content");
                    var field = Aloha.jQuery(element[0]).children().eq(0)
                    var stripStyles = function($content) {
                       $content.find('*[style]').removeAttr("style");
                       return $content
                   };
                    field.aloha();
                    field.on("focusout", function() {
                        $timeout(function() {
                            scope.text = field.text();
                            scope.textmarkup = stripStyles($editableContent).html();
                        });
                    })
                    field.on("keypress", function() {
                        $timeout(function() {
                            scope.text = field.text();
                            scope.textmarkup = stripStyles($editableContent).html();
                        });
                    })
                    field.on("keyup", function() {
                        $timeout(function() {
                            scope.text = field.text();
                            scope.textmarkup = stripStyles($editableContent).html();
                        });
                    })
                    field.on("keydown", function() {
                        $timeout(function() {
                            scope.text = field.text();
                            scope.textmarkup = stripStyles($editableContent).html();
                        });
                    })
                    field.on("cut", function() {
                        $timeout(function() {
                            scope.text = field.text();
                            scope.textmarkup = stripStyles($editableContent).html();
                        });
                    })
                    field.on("paste", function() {
                        $timeout(function() {
                            scope.text = field.text();
                            scope.textmarkup = stripStyles($editableContent).html();
                        });
                    })
              });
            }
        }
    };
}])

.directive('qrcode', function () {
    return {
        scope: {
          code: "="
        },
        restrict: "E",
        replace: true,
        template: '<div id="qrcode"></div>',
        link: function(scope, element, attrs) {
            var qrcode = new QRCode("qrcode", {
                width: 140,
                height: 140
            });
            qrcode.makeCode(scope.code || "qrcode");
        }
    };
})

.filter('trust', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])

.filter('fromnow', [function(){
    return function(text) {
        return moment((new Date(text))).fromNow();
    };
}])

.filter('date', [function(){
    return function(text) {
        return moment((new Date(text))).format('MMMM Do YYYY');
    };
}])
