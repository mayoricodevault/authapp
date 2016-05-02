'use strict';

app.
  controller('ProfileCtrl', ['$scope', 'auth', function ($scope, auth){

  $scope.user = auth.profile;


  }]);

