'use strict';

app

  .controller('ProductsCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$firebaseObject', 'FBURL', '$filter', 'uploadImage', 'user',
    function($scope, $state, $stateParams, $firebaseArray, $firebaseObject, FBURL, $filter, uploadImage, user) {

      // General database variable
      var ref = new Firebase(FBURL);
      $scope.products = $firebaseArray(ref.child('products'));
      $scope.productsObject = $firebaseObject(ref.child('products'));

      $scope.categories = $firebaseArray(ref.child('categories'));
      $scope.categoriesObject = $firebaseObject(ref.child('categories'));
      //////////////////////////// *General database variable

      $scope.user = user;

      // get the model
      if($stateParams.id) {
        var id = $stateParams.id;
        $scope.product = $firebaseObject(ref.child('products').child(id));
      } else {
        $scope.product = {};
      }

      $scope.categories.$loaded().then(function() {
        $scope.childCategories = [];
        //extend array
        angular.forEach($scope.categories, function (value, key) {
          if (value.parentId && $scope.categoriesObject[value.parentId]) {
            value.parentName = $scope.categoriesObject[value.parentId].name;
            $scope.childCategories.push(value);
          } else {
            if ($filter('filter')($scope.categories, {parentId: value.$id}).length === 0) {
              $scope.childCategories.push(value);
            }
          }
        });
      });

      $scope.units = {
        pc: "Piece",
        kg: "Kilogram",
        g: "Gram",
        m: "Meter",
        l: "Liter"
      };

      $scope.statuses = {
        published: "published",
        notPublished: "not published",
        banned: "banned"
      };

      $scope.uploadImages = function (files, user, cb) {
        if (files && files.length) {
          uploadImage.uploadMultiple(files, user, cb);
        }
      };

    }])

  .controller('ProductsListCtrl', ['$scope', '$filter', 'ngTableParams', 'toastr',
    function($scope, $filter, ngTableParams, toastr) {

      //////////////////////////////////////////
      //************ Table Settings **********//
      //////////////////////////////////////////

      // Delete CRUD operation
      $scope.delete = function (product) {
        if (confirm('Are you sure?')) {
          $scope.products.$remove(product).then(function () {
            console.log('product deleted');
            toastr.success('Product Removed!', 'Product has been removed');
          });
        }
      };
      //////////////////////////// *Delete CRUD operation


      // Initialize table
      $scope.products.$loaded().then(function() {

        //extend array
        function extendArray(){
          angular.forEach($scope.products, function(value, key){
            if (value.categoryId && $scope.categoriesObject[value.categoryId]) {
              value.categoryName = $scope.categoriesObject[value.categoryId].name;
            }
          });
        }
        extendArray();
        ///////////////////////////////////////////// *extend array

        // watch data in scope, if change reload table
        $scope.$watchCollection('products', function(newVal, oldVal){
          if (newVal !== oldVal) {
            extendArray();
            $scope.tableParams.reload();
          }
        });

        $scope.$watch('searchText', function(newVal, oldVal){
          if (newVal !== oldVal) {
            $scope.tableParams.reload();
          }
        });
        ///////////////////////////////////////////// *watch data in scope, if change reload table

        $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            id: 'asc'     // initial sorting
          }
        }, {
          total: $scope.products.length, // length of data
          getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
              $filter('orderBy')($scope.products, params.orderBy()) :
              $scope.products;

            orderedData	= $filter('filter')(orderedData, $scope.searchText);
            params.total(orderedData.length);

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
      });
      ////////////////////////////////////////// *Initialize table

    }])

  .controller('NewProductCtrl', ['$scope', 'toastr', '$state', 'FBURL', '$filter',
    function($scope, toastr, $state, FBURL, $filter) {

      var ref = new Firebase(FBURL);

      ref.child('productsCounter')
        .once('value', function(snapshot){
          var data = snapshot.val();
          if (data) {
            $scope.product.id = $filter('digits')(data+1,6);
          } else {
            $scope.product.id = '000001';
          }
        });

      // Submit operation
      $scope.ok = function(form) {

        var x = 0;
        var cb = function(filelink){
          $scope.product.images[x] = {};
          $scope.product.images[x].src = filelink;
          x++;
          if ($scope.product.images.length === x) {
            $scope.products.$add($scope.product).then(function (productRef) {

            ref.child('productsCounter').transaction(function(currentValue) {
                return (currentValue || 0) + 1;
              }, function(err, committed, ss) {
                if( err ) {
                  console.log(err);
                }
                else if(committed) {
                  var id = $filter('digits')(ss.val(),6);

                  ref.child('products').child(productRef.key())
                    .update({id: id, created_at: Firebase.ServerValue.TIMESTAMP});
                }
              });

            toastr.success('Product Added!', 'Product has been created');
            $state.go('app.products.list', {}, {reload: true});
          });
          }
        };

        if (form.images.$valid) {
          $scope.uploadImages($scope.product.images, $scope.user, cb);
        }

      };
      /////////////////////// *Submit operation

    }])

  .controller('EditProductCtrl', ['$scope', '$firebaseObject', 'toastr', '$state', 'FBURL', '$filter',
    function($scope, $firebaseObject, toastr, $state, FBURL, $filter) {

      var ref = new Firebase(FBURL);

      $scope.editing = true;

      $scope.products.$loaded(function(){
        // Submit operation
        $scope.ok = function(form) {

          function save(){
            $scope.product.$save().then(function (productRef) {
              ref.child('products').child(productRef.key())
                .update({updated_at: Firebase.ServerValue.TIMESTAMP});
              toastr.success('Product Saved!', 'Product has been saved');
              $state.go('app.products.list', {}, {reload: true});
            });
          }

          var x = 0;
          var cb = function(filelink){
            $scope.product.images[x] = {};
            $scope.product.images[x].src = filelink;
            x++;
            if ($scope.product.images.length === x) {
              save();
            }
          };

          if (form.images.$modelValue[0] && form.images.$modelValue[0].$ngfDataUrl && form.images.$valid) {
            $scope.uploadImages($scope.product.images, $scope.user, cb);
          } else {
            save();
          }

        };
        /////////////////////// *Submit operation
      });

    }])

  .controller('ShowProductCtrl', ['$scope', '$firebaseObject', 'toastr', '$state', 'FBURL', '$stateParams',
    function($scope, $firebaseObject, toastr, $state, FBURL, $stateParams) {


    }]);
