'use strict';
app.directive('ngShowAuth', ['auth', '$timeout', function (auth, $timeout) {
  var isLoggedIn = !!auth.isAuthenticated;
  console.log('show'+isLoggedIn)
  return {
    restrict: 'A',
    link: function(scope, el) {
      el.addClass('ng-cloak'); // hide until we process it

      function update() {
        // sometimes if ngCloak exists on same element, they argue, so make sure that
        // this one always runs last for reliability
        $timeout(function () {
          el.toggleClass('ng-cloak', !isLoggedIn);
        }, 0);
      }

      update();
    }
  };
}]);
