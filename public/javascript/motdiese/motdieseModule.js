var motdieseModule = angular.module('motdiese.module', ['TouiteurApp']);

motdieseModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/motdiese/:motdiese',    {templateUrl: 'javascript/motdiese/templates/motdiese.html', controller: 'MotdieseCtrl'});
}]);