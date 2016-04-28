'use strict';


app
  .constant('FBURL', 'https://hcapp.firebaseio.com')

  .constant('loginRedirectPath', 'core.login')
  .controller('MainCtrl', ['$scope', 'fbutil', 'FBURL', '$state', 'loginRedirectPath', '$firebaseObject','auth','store',
    function($scope, fbutil, FBURL,  $state, loginRedirectPath, $firebaseObject, auth, store) {
    $scope.main = {
      title: 'Test Bench',
      appName: 'hcappcrud',
      settings: {
        navbarHeaderColor: 'scheme-default',
        sidebarColor: 'scheme-default',
        brandingColor: 'schemse-default',
        activeColor: 'default-scheme-color',
        headerFixed: true,
        asideFixed: true,
        rightbarShow: false
      }
    };
    $scope.settings = $firebaseObject(new Firebase(FBURL).child('settings'));

    $scope.logout = function() {
        auth.signout();
        store.remove('profile');
        store.remove('token');
        $state.go(loginRedirectPath, {}, {reload: true});
    }

  }]);
