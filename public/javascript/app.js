var HOST = "http://localhost:8080";
var SESSION_NAME = "TOUITEUR_TOKEN";

// Declare app level module which depends on filters, and services
var app = angular.module('TouiteurApp', [
    'ngRoute',
    'mgcrea.ngStrap',
    'user.module',
    'touitetimeline.module',
    'login.module',
    'register.module',
    'motdiese.module'
]);

toastr.options = {
    "positionClass": "toast-bottom-right"
};

/**
 * Main configuration
 */
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$route', 'loginService', 'userService', function($scope, $rootScope, $location, $route, loginService, userService) {

    $rootScope.pagination = 10;

    if(sessionStorage[SESSION_NAME] !== undefined){

        loginService.isConnected(sessionStorage[SESSION_NAME])

            .success(function(data, status){
                if(status === 200) {
                    $rootScope.token = sessionStorage[SESSION_NAME];
                    userService.getUser().success(function(dataUser, statusUser){

                        $rootScope.userConnected = dataUser;

                    });
                }
            })
            .error(function(data, status){
                delete sessionStorage[SESSION_NAME];
            });
    }

}]);

app.controller('NavbarCtrl', ['$scope', '$rootScope', '$location', '$route', function($scope, $rootScope, $location, $route) {


    $scope.logout = function(){

        delete $rootScope.token;
        delete $rootScope.userConnected;

        delete sessionStorage[SESSION_NAME];

        $location.path('/login');
    };

    $scope.isConnected = function(){

        return $rootScope.token !== undefined;
    };

    $scope.toTimeline = function(){

        if($location.path() === '/')
            $route.reload();

        else $location.path('/');
    };

    $scope.rechercherMotdiese = function(){

        if($scope.formRechercheMotdiese.$valid){

                $location.path("/motdiese/"+$scope.motdieseRecherche);
                delete $scope.motdieseRecherche;
        }

    };

    $scope.focused = false;
    $scope.getRechercheMotdieseClass = function() {

        if($scope.formRechercheMotdiese.$pristine || !$scope.focused)
            return [];

        else if(!$scope.formRechercheMotdiese.$valid && $scope.focused)
            return ['has-error'];

    }

}]);
