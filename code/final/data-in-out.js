angular.module('Federer')
.controller('FedererCtrl', function($scope, $timeout) {

    $scope.roger = {
        name: 'Roger Federer',
        wimbledons: '0',
        usOpens: '0'
    };

    // References can chain into other locations
    var firebaseRef = new Firebase(
        'https://coedit-4b1b9.firebaseio.com/roger'
    );

    // set the listener to update the values
    rogerRef.on('value', function(snap) {
       $timeout(function() {
          $scope.roger = snap.val();
       });
    });

});
