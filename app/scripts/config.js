'use strict';


app
  .constant('FBURL', 'https://hcapp.firebaseio.com')

  .constant('loginRedirectPath', 'core.login')
  .controller('MainCtrl', ['$scope', 'fbutil', 'FBURL', '$state', 'loginRedirectPath', '$firebaseObject','auth','store','envService',

    function($scope, fbutil, FBURL,  $state, loginRedirectPath, $firebaseObject, auth, store, envService) {

    $scope.main = {
        title: 'Test Bench',
        appName: 'hcappcrud',
        settings: {
            navbarHeaderColor: 'scheme-black',
            sidebarColor: 'scheme-black',
            brandingColor: 'scheme-black',
            activeColor: 'default-scheme-color',
            headerFixed: true,
            asideFixed: true,
            rightbarShow: false
        }
    };
    $scope.settings = $firebaseObject(new Firebase(FBURL).child('settings'));
    $scope.settings.$loaded().then(function() {
        envService.set($scope.settings.currentDomain ? $scope.settings.currentDomain : 'localhost');
    })


    $scope.logout = function() {
        auth.signout();
        store.remove('profile');
        store.remove('token');
        $state.go(loginRedirectPath, {}, {reload: true});
    }

  }]);
