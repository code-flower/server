/* global angular */
'use strict';

angular.module('CodeFlower')
.directive('flowerTerminal', function($rootScope, $timeout, appConfig) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: appConfig.paths.partials + 'flower-terminal.html',
    scope: {
      subscribe: '='
    },
    link: link
  };

  function link(scope, el, attrs) {

    //// PRIVATE VARIABLES ////

    var termBody = angular.element(el[0].querySelector('.terminal-body'));
    var scrollDown = true;
    var timer;

    //// SCOPE VARIABLES ////

    scope.terminalOpen = false;

    //// EVENT LISTENERS ////

    // stop scrolling down for 4 secs
    // if user scrolls inside terminal
    termBody[0].onmousewheel = function() {
      scrollDown = false;

      clearTimeout(timer);
      timer = setTimeout(function() {
        scrollDown = true;
      }, 4000);
    }

    $rootScope.$on('openTerminal', function() {
      console.log("received openTerminal");
      scope.terminalOpen = true;
    });

    $rootScope.$on('closeTerminal', function() {
      $timeout(function() {
        scope.terminalOpen = false;
      }, 0);
    });

    //// COMMANDS ////

    scope.subscribe(function(data) {
      console.log("received data");
      termBody.append(data + '<br>');
      if (scrollDown)
        termBody[0].scrollTop = termBody[0].scrollHeight;
    });

    console.log("scope:", scope);

  }
});

