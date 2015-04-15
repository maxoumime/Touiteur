var touitetimelineModule = angular.module('touitetimeline.module', ['TouiteurApp']);

touitetimelineModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',    {templateUrl: 'javascript/touitetimeline/templates/touiteTimeline.html', controller: 'TouitetimelineCtrl'});
}]);