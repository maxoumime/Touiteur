var accueilModule = angular.module('accueil.module', ['TouiteurApp']);

accueilModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',    {templateUrl: 'javascript/accueil/templates/accueil.html', controller: 'AccueilCtrl'});
}]);