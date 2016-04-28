'use strict';
app.directive('ngHideAuth', ['auth', '$timeout', function (auth, $timeout) {
  var isLoggedIn = !!auth.isAuthenticated;
  console.log('hide'+isLoggedIn)
  return {
    restrict: 'A',
    link: function(scope, el) {
      function update() {
        el.addClass('ng-cloak'); // hide until we process it

        // sometimes if ngCloak exists on same element, they argue, so make sure that
        // this one always runs last for reliability
        $timeout(function () {
          el.toggleClass('ng-cloak', isLoggedIn !== false);
        }, 0);
      }
      update();
    }
  };
}]);
