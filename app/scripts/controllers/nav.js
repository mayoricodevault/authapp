'use strict';

app
  .controller('NavCtrl', function ($scope, auth) {
    $scope.profile={};
    if (auth.isAuthenticated) {
        $scope.profile = auth.profile;
    }

    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };


  });
