/**
 * Created by maxoumime on 13/04/2015.
 */

touitetimelineModule.controller('TouitetimelineCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'touiteTimelineService', 'userService', function($scope, $rootScope, $location, $routeParams, touiteTimelineService, userService) {

    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    $scope.touitePost = {};

    $scope.currentPage = 0;

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

    $scope.getTouites = function(page){

        touiteTimelineService.getTouites(page).success(function(data){

            $scope.touites = [];

            $scope.touitesNbr = data.resultNbr;

            if(page !== undefined)
                $scope.currentPage = page;

            for(var touiteIdIndex in data.touites){

                touiteTimelineService.getTouite(data.touites[touiteIdIndex]).success(function(data, status){

                    $scope.touites.push(data);
                });
            }

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

    $scope.toPage = function(page){

        if(page < 0 || page > $scope.getPagesNumber() )
            return;

        $scope.getTouites(page);
    };

    $scope.getPagesNumber = function(){

        if($scope.touitesNbr < $rootScope.pagination)
            return 0;

        var modulo = ($scope.touitesNbr % $rootScope.pagination);

        return modulo - 1;
    };

    // LETS GO

    $scope.touites = [];

    $scope.getTouites();
    $scope.getUser();

}]);