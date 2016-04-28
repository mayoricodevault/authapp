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
    'angular-jwt'
  ])
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

        .state('app.products', {
            abstract: true,
            url: '/products',
            template: '<div ui-view></div>',
            data: {
                requiresLogin: true
            }
        })
        .state('app.products.list', {
            url: '/list',
            controller: 'ProductsCtrl',
            templateUrl: 'views/pages/products/list.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.products.new', {
            url: '/new',
            controller: 'ProductsCtrl',
            templateUrl: 'views/pages/products/new.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.products.edit', {
            url: '/edit/:id',
            controller: 'ProductsCtrl',
            templateUrl: 'views/pages/products/edit.html',
            data: {
                requiresLogin: true
            }
        })
        .state('app.products.show', {
            url: '/show/:id',
            controller: 'ProductsCtrl',
            templateUrl: 'views/pages/products/show.html',
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
    //$urlRouterProvider.otherwise('app');
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
    // want to check the delegation-token example
    $httpProvider.interceptors.push('jwtInterceptor');

}).run(function($rootScope, $state, auth, store, jwtHelper,loginRedirectPath, $stateParams  ) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeStart', function(event) {
        var token = store.get('token');
        console.log(token);
        if (token) {
            console.log(jwtHelper.isTokenExpired(token));
            if (!jwtHelper.isTokenExpired(token)) {
                console.log(auth.isAuthenticated);
                if (!auth.isAuthenticated) {
                    auth.authenticate(store.get('profile'), token);
                }
            } else {
                // Either show the login page or use the refresh token to get a new idToken
                $state.go('core.login');
            }
        } else {
            $state.go('core.login');
        }

    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        console.log(toState);
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
});