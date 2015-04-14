/**
 * Created by maxoumime on 13/04/2015.
 */

accueilModule.controller('AccueilCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'accueilService', function($scope, $rootScope, $location, $routeParams, accueilService) {

    if($rootScope.token === undefined)
        $location.path('/login');


    //FONCTIONS

    $scope.postTouite = function(){

    };

    $scope.getTouites = function(){

        accueilService.getTouites().success(function(data){

            $scope.touites = data;
        });
    };

    // LETS GO

    $scope.touites = [];

    $scope.getTouites();


}]);