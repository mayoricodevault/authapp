'use strict';
app
  .controller('PatientsCtrl', ['$scope', '$state', '$stateParams', 'Patients', '$filter', 'auth',
    function($scope, $state, $stateParams, Patients, $filter, auth) {
        $scope.AllPatients=[];
        $scope.patient=[];
        $scope.user = auth;

      if($stateParams.id) {
        var id = $stateParams.id;

        var sql =  'thingTypeId=4&_id='+id;
        $scope.AllPatients = new Patients();
        $scope.AllPatients.$find({where : sql}).success(function(results) {
          var current =$scope.AllPatients.$fetch();
          $scope.patient = current.$toObject();
        });

      } else {
        $scope.patients = [];
      }


    }])

  .controller('PatientsListCtrl', ['$scope', '$filter', 'ngTableParams', 'toastr', 'Patients',
    function($scope, $filter, ngTableParams, toastr, Patients) {
      $scope.patients = [];
      $scope.AllPatients = new Patients();

      $scope.AllPatients.$find({where : 'thingTypeId=4'}).success(function(results) {
        var current;
        while(current = $scope.AllPatients.$fetch()) { //fetching on masters object
          $scope.patients.push(current.$toObject());
        }
        $scope.$watch('searchText', function(newVal, oldVal){
          if (newVal !== oldVal) {
            $scope.tableParams.reload();
          }
        });
        $scope.tableParams = new ngTableParams({
              page: 1,            // show first page
              count: 10,          // count per page
              sorting: {
                id: 'asc'     // initial sorting
              }
            }, {
              total: $scope.patients.length, // length of data
              getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                  $filter('orderBy')($scope.patients, params.orderBy()) :
                    $scope.patients;

                orderedData	= $filter('filter')(orderedData, $scope.searchText);
                params.total(orderedData.length);

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
        });
      });


    }])

  .controller('NewPatientCtrl', ['$scope', 'toastr', '$state', 'FBURL', '$filter',
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

  .controller('EditPatientCtrl', ['$scope', 'toastr', '$state', '$filter',
    function($scope, toastr, $state, $filter) {
        console.log($scope.patient);
      $scope.editing = true;
      if ($scope.patient) {
          $scope.ok = function(form) {
              function save(){
                $scope.product.$save().then(function (productRef) {
                  //ref.child('products').child(productRef.key())
                  //  .update({updated_at: Firebase.ServerValue.TIMESTAMP});
                  //toastr.success('Product Saved!', 'Product has been saved');
                  $state.go('app.patients.list', {}, {reload: true});
                });
              }
            };
      }
    }])

  .controller('ShowPatientCtrl', ['$scope', '$firebaseObject', 'toastr', '$state', 'FBURL', '$stateParams',
    function($scope, $firebaseObject, toastr, $state, FBURL, $stateParams) {


    }]);
