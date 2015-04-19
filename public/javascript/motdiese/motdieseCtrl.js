/**
 * Created by maxoumime on 13/04/2015.
 */

motdieseModule.controller('MotdieseCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$route', 'motdieseService', 'touiteTimelineService', function($scope, $rootScope, $location, $routeParams, $route, motdieseService, touiteTimelineService) {

    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    $scope.motdiese = $routeParams.motdiese;

    $scope.getTouites = function(){

        motdieseService.getTouites($scope.motdiese).success(function(data, status){

            $scope.touites = [];
            for(var touiteIdIndex in data){

                touiteTimelineService.getTouite(data[touiteIdIndex]).success(function(dataTouite, statusTouite){

                    $scope.touites.push(dataTouite);
                });
            }
        });
    };

    $scope.getTouites();

}]);