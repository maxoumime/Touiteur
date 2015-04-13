/**
 * Created by maxoumime on 13/04/2015.
 */

loginModule.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$http', function($scope, $rootScope, $location, $routeParams, $http) {

    $scope.login = function(){

        $http.post(host+'/login',{username: $scope.username, password: $scope.password})
        .success(function (data) {
            toastr.success("Connexion Réussie !");
            $rootScope.token = data;
            $location.path('/');
        }).error(function(data, status){

            if(status === 403)
                toastr.error("Mauvais identifiants, veuillez réessayer");
            else toastr.error("Impossible de se connecter.");
        });
    }

}]);