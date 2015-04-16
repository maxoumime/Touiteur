/**
 * Created by maxoumime on 13/04/2015.
 */

loginModule.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$http', 'loginService', 'userService', function($scope, $rootScope, $location, $routeParams, $http, loginService, userService) {

    if($rootScope.token !== undefined)
        $location.path('/');

    $scope.formLoginData = {
        username: "",
        password: ""
    };

    $scope.login = function(){

        loginService.login($scope.formLoginData).success(function(data) {
            toastr.success("Connexion Réussie !");
            $rootScope.token = data;
            $rootScope.usernameConnected = $scope.formLoginData.username;

            userService.getUser($rootScope.usernameConnected).success(function(data, status){

                $rootScope.userConnected = data;
            });

            $location.path('/');
        });
    };

    $scope.register = function(){

        $location.path('/register');
    }

}]);