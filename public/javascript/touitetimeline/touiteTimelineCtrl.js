/**
 * Created by maxoumime on 13/04/2015.
 */

touitetimelineModule.controller('TouitetimelineCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'touiteTimelineService', 'userService', function($scope, $rootScope, $location, $routeParams, touiteTimelineService, userService) {

    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    $scope.touitePost = {};

    //FONCTIONS

    $scope.postTouite = function(){

        var touiteInstantT = $scope.touitePost;

        touiteTimelineService.postTouite($scope.touitePost).success(function(){

            toastr.success("Ce Touite sera d'une grande aide !", "Touite envoyé !");

            if(touiteInstantT === $scope.touitePost)
                delete $scope.touitePost;

            $scope.getTouites();
            $scope.getUser();
        });

    };

    $scope.getTouites = function(){

        touiteTimelineService.getTouites().success(function(data){

            $scope.touites = data;
        });
    };

    $scope.deleteTouite = function(id){

        touiteTimelineService.deleteTouite(id).success(function(data, status){

            toastr.success("Touite supprimé !");
            $scope.getTouites();
        });
    };

    $scope.getUser = function(){

        userService.getUser($rootScope.usernameConnected).success(function(data, status){

            $scope.user = data;
        });
    };

    // LETS GO

    $scope.touites = [];

    $scope.getTouites();
    $scope.getUser();

}]);