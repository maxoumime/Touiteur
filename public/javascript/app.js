var host = "http://localhost:8080";

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

app.controller('NavbarCtrl', ['$scope', '$rootScope', '$location', '$route', function($scope, $rootScope, $location, $route) {

    $rootScope.pagination = 10;

    $scope.logout = function(){

        delete $rootScope.token;
        delete $rootScope.usernameConnected;

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
