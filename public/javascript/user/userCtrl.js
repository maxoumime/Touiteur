/**
 * Created by maxoumime on 13/04/2015.
 */

userModule.controller('UserCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'userService', 'touiteTimelineService', function($scope, $rootScope, $location, $routeParams, userService, touiteTimelineService) {

    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    if($routeParams.user !== undefined)
        $scope.usernameRequested = $routeParams.user;
    else $scope.usernameRequested = $rootScope.usernameConnected;

    $scope.userRequested = {};

    function getUser(username){

        userService.getUser(username).success(function(data, status){

            $scope.userRequested = data;
        });
    }

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

    $scope.deleteTouite = function(id){

        touiteTimelineService.deleteTouite(id).success(function(data, status){

            toastr.success("Touite supprimé !");
            getTouites();
        });
    };

    $scope.isStalking = function(){

        if($rootScope.userConnected.idStalking === undefined)
            return false;


        return $rootScope.userConnected.idStalking.indexOf($scope.usernameRequested) !== -1;
    };

    $scope.stalk = function(){

        userService.stalk($scope.usernameRequested).success(function(data, status){

            getUser($scope.usernameRequested);

            userService.getUser($rootScope.usernameConnected).success(function(data, status){

                $rootScope.userConnected = data;
            });
        });
    };

    $scope.unstalk = function(){

        userService.unstalk($scope.usernameRequested).success(function(data, status){

            getUser($scope.usernameRequested);

            userService.getUser($rootScope.usernameConnected).success(function(data, status){

                $rootScope.userConnected = data;
            });
        });

    };

    getUser($scope.usernameRequested);
    getTouites($scope.usernameRequested);

}]);