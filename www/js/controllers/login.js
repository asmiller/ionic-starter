angular.module('app').controller('LoginCtrl', function ($scope, User, $timeout) {

    $scope.loginData = {};

    $scope.login = function () {
        $scope.loggingIn = true;
        $timeout(function () {
            $scope.logginSuccess = true;
            User.setLoginDetails({name: $scope.loginData.username});
        }, 500);
    };
});
