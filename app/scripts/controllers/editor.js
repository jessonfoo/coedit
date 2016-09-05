angular.module('coeditApp', ['firebase'])

.constant('FBURL', 'https://coedit-4b1b9.firebaseio.com/')

.factory('Fb', function(FBURL) {
    return new Firebase(FBURL);
})

.factory('Secret', function(Fb, $firebase) {
    return $firebase(Fb.child('secret'))
})

.factory('Auth', function(Fb, $firebaseSimpleLogin, $rootScope) {
    var simpleLogin = $firebaseSimpleLogin(Fb);
    return {
        login: function(user) {
          return simpleLogin.$login('password', {
               email: user.email,
               password: user.password
            });
        },
        logout: function() {
            simpleLogin.$logout();
        },
        onLogin: function(cb) {
            $rootScope.$on('$firebaseSimpleLogin:login',
            function(e, user) {
                cb(e, user);
            });
        }
    }
})

.controller('editor', function($scope, Auth, Secret) {
    $scope.secret = '';
});
