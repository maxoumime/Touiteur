var host = "http://localhost:8080";

// Declare app level module which depends on filters, and services
var app = angular.module('TouiteurApp', [
    'ngRoute',
    'login.module'
]);

/**
 * Main configuration
 */
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);