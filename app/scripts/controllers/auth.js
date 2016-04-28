'use strict';

app.controller('AuthCtrl', ['$scope', 'auth', 'toastr', function($scope, auth, toastr) {

  toastr.success('demo@mojix.io, pass: demo', 'Login default data!', {progressBar: true, timeOut: '15000'});

  $scope.auth = auth;
  $scope.configs = {
    icon: 'http://www.mojix.com/wp-content/uploads/2015/10/logo-mojix.svg',
    dict: {
    signin: {
      title: 'Login me in',
          emailPlaceholder: 'something@youremail.com'
    }
  }};


}]);
