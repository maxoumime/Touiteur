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

            toastr.success("Félicitations ! Ce Touite sera d'une grande aide !" ,"Touite envoyé !");

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

    // LETS GO

    $scope.touites = [];

    $scope.getTouites();


}]);