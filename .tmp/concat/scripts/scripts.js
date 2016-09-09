'use strict';

/**
 * @ngdoc overview
 * @name coeditApp
 * @description
 * # coeditApp
 *
 * Main module of the application.
 */
angular.module('coeditApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.Auth'
  ]);

'use strict';

/**
 * @ngdoc function
 * @name coeditApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the coeditApp
 */
angular.module('coeditApp')
  .controller('MainCtrl', ["auth", "$scope", "$location", function (auth, $scope, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.logout = function () {
      auth.$signOut();
      console.log('logged out');
      $location.path('/login');
      $scope.authData = null;
    };

  }]);

'use strict';
/**
 * @ngdoc function
 * @name coeditApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('coeditApp')
  .controller('Chat', ["$scope", "currentAuth", "$firebaseArray", "$timeout", function ($scope, currentAuth, $firebaseArray, $timeout) {
    $scope.user = currentAuth;

    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    var query = rootRef.child('messages').limitToLast(10);
    var messages = $firebaseArray(query);

    messages.$loaded()
      .then(function () {
        $scope.messages = messages;
      })
      .catch(alert);

    // provide a method for adding a message
    $scope.addMessage = function (newMessage) {
      if (newMessage) {
        // push messages to the end of the array
        $scope.messages.$add({
          text: newMessage,
          user: currentAuth.displayName,
          userId: currentAuth.uid
        })
          .catch(alert);
      }
    };

    function alert(msg) {
      $scope.err = msg;
      console.log(msg);
      $timeout(function () {
        $scope.err = null;
      }, 5000);
    }
  }]);

'use strict';

angular.module('coeditApp')
  .filter('reverse', function() {
    return function(items) {
      return angular.isArray(items)? items.slice().reverse() : [];
    };
  });

'use strict';
angular.module('firebase.Auth', [])
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','google'])
  .constant('loginRedirectPath', '/login')
  .factory('auth', ["$firebaseAuth", function ($firebaseAuth) {
      return $firebaseAuth();
  }]);

'use strict';
/**
 * @ngdoc function
 * @name coeditApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('coeditApp')
  .controller('LoginCtrl', ["$scope", "auth", "$location", function ($scope, auth, $location) {

    $scope.loginBtn = true;
    $scope.logoutBtn = true;

    auth.$onAuthStateChanged(function (authData) {
      if (authData) {
        console.log(" logged: " + authData.uid);
        $scope.logoutBtn = true;
        $scope.loginBtn = false;
        $location.path('/account');
      }
    });

    

      // SignIn with a Provider
      $scope.oauthLogin = function (provider) {
        auth.$signInWithPopup(provider)
          .then(function (authData) {
            console.log("logged");
            redirect();
          })
          .catch(function (error) {
            console.log("login error");
            showError(error);
          })
      };

      // Anonymous login method
      $scope.anonymousLogin = function () {
        auth.$signInAnonymously()
          .then(function (authData) {
            console.log("logged ", authData.uid);
          })
          .catch(function (error) {
            console.log("login error ", error);
          })
      };

    

    

      // Autenthication with password and email
      $scope.passwordLogin = function (email, pass) {

        auth.$signInWithEmailAndPassword(email, pass)
          .then(function (authData) {
            redirect();
            console.log("logged");
          })
          .catch(function (error) {
            showError(error);
            console.log("error: " + error);
          });
      };

      $scope.createAccount = function (email, pass, confirm) {
        $scope.err = null;

        if (!pass) {
          $scope.err = 'Please enter a password';
        } else if (pass !== confirm) {
          $scope.err = 'Passwords do not match';
        } else {
          auth.$createUserWithEmailAndPassword(email, pass)
            .then(function (userData) {
              console.log("User " + userData.uid + " created successfully");
              return userData;
            })
            .then(function (authData) {
            console.log("Logged user: ", authData.uid);
              createProfile();
              redirect();
            })
            .catch(function (error) {
              console.error("Error: ", error);
            });
          }
        };

        //todo wait till SDK 3.x support comes up to test
        function createProfile(user) {

          // var query =
          var userObj = rootRef.child('users').child(user.uid);
          var def = $q.defer();
          ref.set({email: email, name: firstPartOfEmail(email)}, function (err) {
            $timeout(function () {
              if (err) {
                def.reject(err);
              }
              else {
                def.resolve(ref);
              }
            });
          });
          return def.promise;
        }

      function firstPartOfEmail(email) {
        return ucfirst(email.substr(0, email.indexOf('@')) || '');
      }

      function ucfirst(str) {
        // inspired by: http://kevin.vanzonneveld.net
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
      }

    

    function redirect() {
      $location.path('/account');
    }

    function showError(err) {
      $scope.err = err;
    }


  }]);

'use strict';

angular.module('coeditApp')
  .controller('AccountCtrl', ["$scope", "auth", "currentAuth", function (
    $scope,
    auth,
    currentAuth
  , $timeout 
  ) {

  $scope.user = {
    uid: currentAuth.uid,
    name: currentAuth.displayName,
    photo: currentAuth.photoURL,
    email: currentAuth.email
  };

    

    $scope.authInfo = currentAuth;
    
    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;

      if( !oldPass || !newPass ) {
        error('Please enter all fields');

      } else if( newPass !== confirm ) {
        error('Passwords do not match');

      } else {
        // New Method
        auth.$updatePassword(newPass).then(function() {
          console.log('Password changed');
        }, error);

      }
    };

    $scope.changeEmail = function (newEmail) {
      auth.$updateEmail(newEmail)
        .then(function () {
          console.log("email changed successfully");
        })
        .catch(function (error) {
          console.log("Error: ", error);
        })
    };

    $scope.logout = function() {
      auth.$signOut();
    };

    function error(err) {
      console.log("Error: ", err);
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

  $scope.updateProfile = function(name, imgUrl) {
    firebase.auth().currentUser.updateProfile({
      displayName: name,
      photoURL: imgUrl
    })
      .then(function () {
        console.log("updated");
      })
      .catch(function (error) {
        console.log("error ", error);
      })
  };

  }]);

'use strict';

angular.module('coeditApp')
  .controller('EditorCtrl', ["$scope", "auth", "currentAuth", function (
    $scope,
    auth,
    currentAuth
  , $timeout 
  ) {

  $scope.user = {
    uid: currentAuth.uid,
    name: currentAuth.displayName,
    photo: currentAuth.photoURL,
    email: currentAuth.email
  };

    

    $scope.authInfo = currentAuth;
    
    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;

      if( !oldPass || !newPass ) {
        error('Please enter all fields');

      } else if( newPass !== confirm ) {
        error('Passwords do not match');

      } else {
        // New Method
        auth.$updatePassword(newPass).then(function() {
          console.log('Password changed');
        }, error);

      }
    };

    $scope.changeEmail = function (newEmail) {
      auth.$updateEmail(newEmail)
        .then(function () {
          console.log("email changed successfully");
        })
        .catch(function (error) {
          console.log("Error: ", error);
        })
    };

    $scope.logout = function() {
      auth.$signOut();
    };

    function error(err) {
      console.log("Error: ", err);
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

  $scope.updateProfile = function(name, imgUrl) {
    firebase.auth().currentUser.updateProfile({
      displayName: name,
      photoURL: imgUrl
    })
      .then(function () {
        console.log("updated");
      })
      .catch(function (error) {
        console.log("error ", error);
      })
  };

  }]);

/**
 * @ngdoc function
 * @name coeditApp.directive:ngShowAuth
 * @description
 * # ngShowAuthDirective
 * A directive that shows elements only when user is logged in. It also waits for Auth
 * to be initialized so there is no initial flashing of incorrect state.
 */
angular.module('coeditApp')
  .directive('ngShowAuth', ['auth', '$timeout', function (auth, $timeout) {
    'use strict';

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !auth.$getAuth());
          }, 0);
        }

        auth.$onAuthStateChanged(update);
        update();
      }
    };
  }]);

angular.module('coeditApp')
  .directive('ngHideAuth', ['auth', '$timeout', function (auth, $timeout) {
    'use strict';

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it
        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !!auth.$getAuth());
          }, 0);
        }

        auth.$onAuthStateChanged(update);
        update();
      }
    };
  }]);

'use strict';
/**
 * @ngdoc overview
 * @name coeditApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire-express:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function($firebaseAuth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */
angular.module('coeditApp')

/**
 * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
 * when called, invokes Auth.$requireAuth() service (see Auth.js).
 *
 * The promise either resolves to the authenticated user object and makes it available to
 * dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
 * forcing a redirect to the /login page
 */

/*
 * Commented due to issues with the new SDK
 *
 .config(['$routeProvider', 'SECURED_ROUTES', function ($routeProvider, SECURED_ROUTES) {

 // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
 // unfortunately, a decorator cannot be use here because they are not applied until after
 // the .config calls resolve, so they can't be used during route configuration, so we have
 // to hack it directly onto the $routeProvider object
 /*
 $routeProvider.whenAuthenticated = function (path, route) {
 route.resolve = route.resolve || {};
 route.resolve.user = ['auth', function (auth) {
 return auth.$requireSignIn();
 }];
 $routeProvider.when(path, route);
 SECURED_ROUTES[path] = true;
 return $routeProvider;
 };
 }])
 */

// configure views; whenAuthenticated adds a resolve method to ensure users authenticate
// before trying to access that route
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          "currentAuth": ["auth", function (auth) {
            return auth.$waitForSignIn();
          }]
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        resolve: {
          "currentAuth": ["auth", function (auth) {
            // returns a promisse so the resolve waits for it to complete
            return auth.$requireSignIn();
          }]
        }
      })
      .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'Chat',
        resolve: {
          "currentAuth": ["auth", function (auth) {
            return auth.$waitForSignIn();
          }]
        }
      })
      .when('/editor', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl',
        resolve: {
          "currentAuth": ["auth", function (auth) {
            return auth.$waitForSignIn();
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  }])

  /**
   * Apply some route security. Any route's resolve method can reject the promise with
   * "AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
   * for changes in auth status which might require us to navigate away from a path
   * that we can no longer view.
   */
  .run(['$rootScope', '$location', 'loginRedirectPath',
    function ($rootScope, $location, loginRedirectPath, event, next, previous, error) {


      // watch for login status changes and redirect if appropriate
      // auth.$onAuthStateChanged(check);

      // some of our routes may reject resolve promises with the special {authRequired: true} error
      // this redirects to the login page whenever that is encountered
      $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
        if (error === "AUTH_REQUIRED") {
          $location.path(loginRedirectPath);
        }
      });
    }
  ]);
