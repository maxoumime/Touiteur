//URL de base de l'application REST
var HOST = "http://localhost:8080";
//Nom de la variable de session
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

//Options de toastr
toastr.options = {
    "positionClass": "toast-bottom-right"
};

/**
 * Main configuration
 */
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);

/**
 * Contrôlleur principal
 */
app.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$route', 'loginService', 'userService', function($scope, $rootScope, $location, $route, loginService, userService) {

    $rootScope.pagination = 10;

    /**
     * Recharge l'utilisateur connecté
     */
    $rootScope.reloadConnectedUser = function(){
        userService.getUser().success(function(dataUser, statusUser){

            $rootScope.userConnected = dataUser;

        });
    };

    //Si un token est présent dans le navigateur
    if(sessionStorage[SESSION_NAME] !== undefined){

        //On le récupère pour retrouver l'utilisateur connecté
        loginService.isConnected(sessionStorage[SESSION_NAME])

            .success(function(data, status){
                if(status === 200) {
                    $rootScope.token = sessionStorage[SESSION_NAME];
                    $rootScope.reloadConnectedUser();
                }
            })
            .error(function(data, status){
                delete sessionStorage[SESSION_NAME];
            });
    }

}]);

/**
 * Contrôlleur de la navbar
 */
app.controller('NavbarCtrl', ['$scope', '$rootScope', '$location', '$route', function($scope, $rootScope, $location, $route) {


    /**
     * Déconnexion de l'utilisateur
     */
    $scope.logout = function(){

        delete $rootScope.token;
        delete $rootScope.userConnected;

        delete sessionStorage[SESSION_NAME];

        $location.path('/login');
    };

    /**
     * Détermine si l'utilisateur est connecté
     * @returns {boolean}
     */
    $scope.isConnected = function(){

        return $rootScope.token !== undefined;
    };

    /**
     * Renvoie vers la timeline
     */
    $scope.toTimeline = function(){

        if($location.path() === '/')
            $route.reload();

        else $location.path('/');
    };

    /**
     * Recherche un mot-dièse
     */
    $scope.rechercherMotdiese = function(){

        if($scope.formRechercheMotdiese.$valid){

                $location.path("/motdiese/"+$scope.motdieseRecherche);
                delete $scope.motdieseRecherche;
        }

    };

    //Stocke le focus
    $scope.focused = false;

    /**
     * Renvoie la classe pour le champ de recherche de mot-dièse
     * @returns {*}
     */
    $scope.getRechercheMotdieseClass = function() {

        if($scope.formRechercheMotdiese.$pristine || !$scope.focused)
            return [];

        else if(!$scope.formRechercheMotdiese.$valid && $scope.focused)
            return ['has-error'];

    }

}]);
