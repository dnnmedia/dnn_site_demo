'use strict';

// Declare app level module which depends on views, and components
angular.module('DNN', [
  'ngRoute',
  'ngSanitize'
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
      template: '<div class="dropdown" style="">\
          <div class="selected value">\
              <span class="value-picture flag-us"></span>\
              <span class="value-name">US</span>\
              <span class="arrow"></span>\
          </div>\
          <div class="values">\
              <div class="value">\
                  <span class="value-picture flag-us"></span>\
                  <span class="value-name">US</span>\
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
        template: '<div class="image" style="" ><div class="image-overlay"></div></div>',
        link: function(scope, element, attrs) {
          if (typeof DNN === "object" && scope.hash) {
              scope.$watch("hash", function() {
                  DNN.Request.get("/api/v1/media/" + scope.hash).then(function(data) {
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
          if (typeof DNN === "object"  && scope.hash) {
              scope.$watch("hash", function()  {
                  DNN.Request.get("/api/v1/media/" + scope.hash).then(function(data) {
                      $timeout(function() {
                          element.attr("src", data.replace(/"/g, ""));
                      })
                  })
              })
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
