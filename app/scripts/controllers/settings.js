'use strict';

app
  .controller('SettingsCtrl', ['$scope', '$state', '$stateParams', 'currentUser', 'user', '$filter',
    function($scope, $state, $stateParams, currentUser, user, $filter, toastr, toastrConfig) {

      $scope.saveSettings = function(){
        $scope.settings.$save();
      };

    }]);
