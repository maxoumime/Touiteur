/**
 * Created by maxoumime on 13/04/2015.
 */

accueilModule.controller('AccueilCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'accueilService', function($scope, $rootScope, $location, $routeParams, accueilService) {

    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    $scope.touitePost = {};

    //FONCTIONS

    $scope.postTouite = function(){

        var touiteInstantT = $scope.touitePost;

        accueilService.postTouite($scope.touitePost).success(function(){

            toastr.success("Ce Touite sera d'une grande aide !" ,"Touite envoyé !");

            if(touiteInstantT === $scope.touitePost)
                delete $scope.touitePost;

            $scope.getTouites();
        });

    };

    $scope.getTouites = function(){

        accueilService.getTouites().success(function(data){

            $scope.touites = data;
        });
    };

    $scope.deleteTouite = function(id){

        accueilService.deleteTouite(id).success(function(data, status){

            toastr.success("Touite supprimé !");
            $scope.getTouites();
        });
    };

    // LETS GO

    $scope.touites = [];

    $scope.getTouites();


}]);