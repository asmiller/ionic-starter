angular.module('app').factory('User', function ($ionicModal, $q, $location) {

    var user = {}, loginModal;

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/modals/login.html', {}).then(function (modal) {
        loginModal = modal;
    });

    user.login = function () {
        if (!user.name) {
            loginModal.show();
        }
    };

    user.setLoginDetails = function (data) {
        user.name = data.name;
        loginModal.hide();
        $location.url('/');
    };

    user.logout = function () {
        user.name = undefined;
        loginModal.show();
    };

    return user;
});