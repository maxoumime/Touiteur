/**
 * Created by maxoumime on 13/04/2015.
 */

loginModule.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$http', 'loginService', function($scope, $rootScope, $location, $routeParams, $http, loginService) {

    $scope.formLoginData = {};

    $scope.login = function(){

        loginService.login($scope.formLoginData).success(function (data) {
            toastr.success("Connexion Réussie !");
            $rootScope.token = data;
            $location.path('/');
        });
    };

    $scope.register = function(){

        $location.path('/register');
    }

}]);