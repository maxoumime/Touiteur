var userModule = angular.module('user.module', ['TouiteurApp']);

userModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/user',    {templateUrl: 'javascript/user/templates/user.html', controller: 'UserCtrl'});
    $routeProvider.when('/user/:user',    {templateUrl: 'javascript/user/templates/user.html', controller: 'UserCtrl'});
}]);