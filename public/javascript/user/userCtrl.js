/**
 * Created by maxoumime on 13/04/2015.
 */

userModule.controller('UserCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$modal', 'userService', 'touiteTimelineService', function($scope, $rootScope, $location, $routeParams, $modal, userService, touiteTimelineService) {

    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    function getUser(username){

        userService.getUser(username).success(function(data, status){

            $scope.userRequested = data;
        });
    }

    function getTouites(user){

        userService.getTouites(user).success(function(data, status){

            $scope.touites = [];

            for(var idIndex in data){

                touiteTimelineService.getTouite(data[idIndex]).success(function(dataTouite, status){

                    $scope.touites.push(dataTouite);
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

        if($rootScope.userConnected === undefined || $rootScope.userConnected.idStalking === undefined)
            return false;


        return $rootScope.userConnected.idStalking.indexOf($scope.usernameRequested) !== -1;
    };

    $scope.stalk = function(){

        userService.stalk($scope.usernameRequested).success(function(data, status){

            getUser($scope.usernameRequested);

            userService.getUser($rootScope.userConnected.id).success(function(dataUser, status){

                $rootScope.userConnected = dataUser;
            });
        });
    };

    $scope.unstalk = function(){

        userService.unstalk($scope.usernameRequested).success(function(data, status){

            getUser($scope.usernameRequested);

            userService.getUser($rootScope.userConnected.id).success(function(dataUser, status){

                $rootScope.userConnected = dataUser;
            });
        });

    };

    function isFormEditionValid(){

        for(var formIndex in $scope.formEditionData)
            if($scope.formEditionData[formIndex].length === 0)
                delete $scope.formEditionData[formIndex];

        if($scope.formEditionData === undefined)
            return false;

        if($scope.formEditionData.oldPassword !== undefined && $scope.formEditionData.oldPassword.length > 0 && $scope.formEditionData.password !== undefined && $scope.formEditionData.password.length > 0)
            return true;

        return ( ($scope.formEditionData.name !== undefined && $scope.formEditionData.name.length > 0)
                    ||
                  ($scope.formEditionData.email !== undefined && $scope.formEditionData.email > 0) );
    }

    $scope.editModal = function(){

        $scope.opennedModal = $modal(
            {
                scope: $scope,
                template: 'javascript/user/templates/editFormModal.html',
                html: true,
                show: true
            }
        );
    };

    $scope.editUser = function(){


        if(isFormEditionValid()) {

            userService.update($scope.formEditionData).success(function() {

                toastr.success("Utilisateur modifié !");
                userService.getUser($rootScope.userConnected.id).success(function(data, status){

                    $scope.opennedModal.hide();
                    delete $scope.opennedModal;

                    $scope.formEditionData = {};
                    $rootScope.userConnected = data;
                    getUser($scope.usernameRequested);
                });

            });
        }else toastr.error("Formulaire invalide !");
    };

    $scope.deleteModal = function(){

        $scope.opennedModal = $modal(
            {
                scope: $scope,
                template: 'javascript/user/templates/deleteModal.html',
                html: true,
                show: true
            }
        );
    };

    $scope.deleteUser = function(){

        $scope.opennedModal.hide();
        delete $scope.opennedModal;

        userService.delete().success(function(data, status){

            toastr.success("Utilisateur supprimé !");
            delete $rootScope.token;
            delete $rootScope.userConnected;
            delete sessionStorage[SESSION_NAME];
            $location.path('/login');
        });
    };

    if($routeParams.user !== undefined) {
        $scope.usernameRequested = $routeParams.user;
        getUser($scope.usernameRequested);
        getTouites($scope.usernameRequested);
    }else{
        $scope.$watch('userConnected', function(newValue, oldValue){

            if($rootScope.userConnected !== undefined){
                $scope.usernameRequested = $rootScope.userConnected.id;
                getUser($scope.usernameRequested);
                getTouites($scope.usernameRequested);
            }
        });
    }

    $scope.userRequested = {};

    $scope.formEditionData = {};


}]);