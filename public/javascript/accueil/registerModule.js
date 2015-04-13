var loginModule = angular.module('login.module', ['TouiteurApp']);

loginModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login',    {templateUrl: 'templates/login.html', controller: 'LoginCtrl'});
}]);