'use strict';

app
  .controller('DashboardCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$firebaseObject', 'FBURL', '$filter', 'auth', 'toastr',
    function($scope, $state, $stateParams, $firebaseArray, $firebaseObject, FBURL, $filter, auth, toastr) {

      $scope.page = {
        title: 'Dashboard'
      };

      // General database variable
      var ref = new Firebase(FBURL);
      $scope.products = $firebaseArray(ref.child('products'));

    }])


  .controller('ProductsChartCtrl', ['$scope', '$filter', '$http',
    function($scope, $filter, $http) {


    }
  ]);
