var registerModule = angular.module('register.module', ['TouiteurApp']);

registerModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register',    {templateUrl: 'javascript/register/templates/register.html', controller: 'RegisterCtrl'});
}]);