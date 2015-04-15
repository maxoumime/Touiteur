var host = "http://localhost:8080";

// Declare app level module which depends on filters, and services
var app = angular.module('TouiteurApp', [
    'ngRoute',
    'user.module',
    'touitetimeline.module',
    'login.module',
    'register.module'
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

app.controller('NavbarCtrl', ['$scope', '$rootScope', '$location', '$routeParams', function($scope, $rootScope, $location, $routeParams) {

    $scope.logout = function(){

        delete $rootScope.token;
        delete $rootScope.username;

        $location.path('/login');
    };

    $scope.isConnected = function(){

        return $rootScope.token !== undefined;
    }

}]);
