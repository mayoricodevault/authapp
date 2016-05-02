'use strict';

app.controller('AuthCtrl', ['$scope', 'auth', 'toastr', function($scope, auth, toastr) {

  toastr.success('Internal User Only', 'Test Bench Apps', {progressBar: true, timeOut: '15000'});

  $scope.auth = auth;
  $scope.configs = {
    icon: 'http://www.mojix.com/wp-content/uploads/2015/10/logo-mojix.svg',
    scope: 'openid name email',
    dict: {
      signin: {
        title: 'Log me in',
            emailPlaceholder: 'demo@demo.com'
      }
  }};

}]);
