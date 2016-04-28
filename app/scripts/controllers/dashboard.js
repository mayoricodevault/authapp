'use strict';

app
  .controller('DashboardCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$firebaseObject', 'FBURL', '$filter', 'uploadImage', 'auth', 'toastr',
    function($scope, $state, $stateParams, $firebaseArray, $firebaseObject, FBURL, $filter, uploadImage, auth, toastr) {

      toastr.warning('Set-up s3upload.js service to use proper data for uploading, for help read <a href="http://beckcd.com/nashville/software/school/2014/11/29/file-uploading-with-angular/" target="_blank">this article</a>', 'Amazon S3 Upload!', {progressBar: true, timeOut: '30000', allowHtml: true});

      $scope.page = {
        title: 'Dashboard'
      };

      // General database variable
      var ref = new Firebase(FBURL);
      $scope.products = $firebaseArray(ref.child('products'));

    }])


  .controller('ProductsChartCtrl', ['$scope', '$filter', '$http',
    function($scope, $filter, $http) {

      $scope.chart = [
        {
          value: 0,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: ""
        },
        {
          value: 0,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: ""
        },
        {
          value: 0,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: ""
        }
      ];

        $scope.products.$loaded(function(){

          var parentCategories = $filter('filter')($scope.categories, {parent: true});
          var childCategories = $filter('filter')($scope.categories, {parent: false});

          angular.forEach(parentCategories, function(val, key){
            var quantity = 0;

            angular.forEach(childCategories, function(category){
              var x = 0;
              angular.forEach($scope.products, function(product){
                if (product.categoryId === category.$id) {
                  x++;
                }
              });
              if (category.parentId === val.$id && x > 0) {
                quantity++;
              }
            });

            $scope.chart[key].label = val.name;
            $scope.chart[key].value = quantity;
          });

        });

    }
  ]);
