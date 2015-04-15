/**
 * Created by maxoumime on 13/04/2015.
 */

userModule.controller('UserCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'userService', 'touiteTimelineService', function($scope, $rootScope, $location, $routeParams, userService, touiteTimelineService) {

    //TODO ou param isuser inconnu
    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    $scope.user = {};

    function getUser(username){

        userService.getUser(username).success(function(data, status){

            $scope.user = data;
        });
    }

    $scope.deleteTouite = function(id){

        touiteTimelineService.deleteTouite(id).success(function(data, status){

            toastr.success("Touite supprimé !");
            $scope.getTouites();
        });
    };

    $scope.isStalking = function(){

        if($scope.user.idStalking === undefined)
            return false;

        return $scope.user.idStalking.indexOf($rootScope.username) === -1;
    };

    function getTouites(user){

        userService.getTouites(user).success(function(data, status){

            $scope.touites = [];

            for(var idIndex in data){

                touiteTimelineService.getTouite(data[idIndex]).success(function(data, status){

                    $scope.touites.push(data);
                });
            }
        });
    }

    getUser("maxoumime2");
    getTouites("maxoumime2");

}]);