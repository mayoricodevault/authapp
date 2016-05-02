'use strict';

var app = angular
  .module('hcappcrud', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'ui.router',
    'ui.bootstrap',
    'ngTable',
    'ui.utils',
    'toastr',
    'localytics.directives',
    'ngFileUpload',
    'slick',
    'angles',
    'auth0',
    'angular-storage',
    'angular-jwt',
    'CoreModel',
    'environment'
  ]).config(function(envServiceProvider) {
        envServiceProvider.config({
            domains: {
                development: 'localhost',
                production:  '52.38.207.25',
                demo:  '52.73.55.136'
            },
            vars: {
                development: {
                    loginApi: '',
                    coreServicesUrl : 'http://52.73.55.136:8080/riot-core-services/api/',
                    api_key : 'root',
                    debug : true,
                    app_version : '1.0.0'
                },
                production: {
                    loginApi: '',
                    coreServicesUrl :'http://52.38.207.25:8080/riot-core-services/api/',
                    api_key : 'root',
                    debug : true,
                    app_version : '1.0.0'
                },
                demo: {
                    loginApi: '',
                    coreServicesUrl :'http://52.73.55.136:8080/riot-core-services/api/',
                    api_key : 'root',
                    debug : true,
                    app_version : '1.0.0'
                }
            }
        });
        envServiceProvider.check();
    })

.config( function ( $stateProvider, authProvider, $httpProvider, $locationProvider, jwtInterceptorProvider) {


    $stateProvider
        .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'views/app.html',
            data: {
                requiresLogin: false
            }
        })
        .state('app.dashboard', {
            url: '/dashboard',
            controller: 'DashboardCtrl',
            templateUrl: 'views/pages/dashboard.html',
            data: {
                requiresLogin: true
            }
        })

        .state('app.patients', {
            abstract: true,
            url: '/patients',
            template: '<div ui-view></div>',
            data: {
                requiresLogin: true
            }
        })
        .state('app.patients.list', {
            url: '/list',
            controller: 'PatientsCtrl',
            templateUrl: 'views/pages/patients/list.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.patients.new', {
            url: '/new',
            controller: 'PatientsCtrl',
            templateUrl: 'views/pages/patients/new.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.patients.edit', {
            url: '/edit/:id',
            controller: 'PatientsCtrl',
            templateUrl: 'views/pages/patients/edit.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.patients.show', {
            url: '/show/:id',
            controller: 'PatientsCtrl',
            templateUrl: 'views/pages/patients/show.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.profile', {
            url: '/profile',
            controller: 'ProfileCtrl',
            templateUrl: 'views/pages/profile.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.settings', {
            url: '/settings',
            controller: 'SettingsCtrl',
            templateUrl: 'views/pages/settings.html',
            data: {
                requiresLogin: true
            }
        })
        .state('core', {
            abstract: true,
            url: '/core',
            template: '<div ui-view></div>',
            containerClass: 'core',
            data: {
                requiresLogin: false
            }
        })
        .state('core.login', {
            url: '/login',
            controller: 'AuthCtrl',
            templateUrl: 'views/pages/login.html',
            containerClass: 'core',
            data: {
                requiresLogin: false
            }
        });

    //$stateProvider.otherwise('/app/dashboard');

    authProvider.init({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        loginState: 'core.login'
    });

    authProvider.on('loginSuccess', function($state, profilePromise, idToken, store) {
        console.log("Login Success");
        profilePromise.then(function(profile) {
            store.set('profile', profile);
            store.set('token', idToken);
        });
        $state.go('app.dashboard');

    });

    authProvider.on('loginFailure', function() {
        alert("Error");
    });

    authProvider.on('authenticated', function($state) {


    });

    jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get('token');
    }

    // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
    // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
    // want to check the delegation-tok
    //
    // en example
    $httpProvider.interceptors.push('jwtInterceptor');

})
    .config(function($httpProvider) {
        var api_key = 'root';
        $httpProvider.defaults.headers.common["x-pm-appversion"] = 'tb_' + '1.0.0';
        $httpProvider.defaults.headers.common["x-pm-apiversion"] = '1.0.0';
        $httpProvider.defaults.withCredentials = true;
        if (angular.isUndefined($httpProvider.defaults.headers.get)) {
            $httpProvider.defaults.headers.get = {};
        }
        //disable IE ajax request caching (don't use If-Modified-Since)
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['api_key'] = api_key;
        $httpProvider.defaults.headers.get['content-type'] = 'application/json';
        $httpProvider.defaults.headers.get.Pragma = 'no-cache';
    })

    .run(function($rootScope, $state, auth, store, jwtHelper,loginRedirectPath, $stateParams  ) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeStart', function(event) {
        var token = store.get('token');
        if (token) {
            //console.log(jwtHelper.isTokenExpired(token));
            if (!jwtHelper.isTokenExpired(token)) {
                //console.log(auth.isAuthenticated);
                if (!auth.isAuthenticated) {
                    auth.authenticate(store.get('profile'), token);
                }
            }
        }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        //console.log(toState);
        event.targetScope.$watch('$viewContentLoaded', function () {
            angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);
            setTimeout(function () {
                angular.element('#wrap').css('visibility','visible');
                if (!angular.element('.dropdown').hasClass('open')) {
                    angular.element('.dropdown').find('>ul').slideUp();
                }
            }, 200);
        });
        $rootScope.containerClass = toState.containerClass;
        if (toState.name =='core.login' && auth.isAuthenticated) {
            $state.go('app.dashboard');
        }
    });

    // some of our routes may reject resolve promises with the special {authRequired: true} error
    // this redirects to the login page whenever that is encountered
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        console.log(error);
        if (error === "AUTH_REQUIRED") {
            $state.go(loginRedirectPath);
        }
    });
})
    .run(function(auth) {
        // This hooks al auth events to check everything as soon as the app starts
        auth.hookEvents();
    });