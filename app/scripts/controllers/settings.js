'use strict';

app
  .controller('SettingsCtrl', ['$scope', '$state', '$stateParams', 'auth', '$filter','toastr','envService','loginRedirectPath',
    function($scope, $state, $stateParams, auth, $filter, toastr, envService, loginRedirectPath) {
        var allVars = envService.read('all');
        $scope.domains ={};

        $scope.domains = envService.data.domains;
        $scope.settings.currentDomain  = $scope.settings.currentDomain ? $scope.settings.currentDomain : envService.get();
        $scope.saveSettings = function(){
            $scope.settings.$save();
            envService.set($scope.settings.currentDomain ? $scope.settings.currentDomain : 'localhost');

            $state.go(loginRedirectPath, {}, {reload: true});

        };

    }]);
