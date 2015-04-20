/**
 * Created by maxoumime on 13/04/2015.
 */

userModule.controller('UserCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$modal', 'userService', 'touiteTimelineService', function($scope, $rootScope, $location, $routeParams, $modal, userService, touiteTimelineService) {

    if($rootScope.token === undefined) {
        $location.path('/login');
        return;
    }

    /**
     * Récupération de l'utilisateur cible
     * @param username
     */
    function getUser(username){

        userService.getUser(username).success(function(data, status){

            $scope.userRequested = data;
        });
    }

    /**
     * Récupération des touites d'un utilisateur
     * @param user
     */
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

    /**
     * Suppression des touites d'un utilisateur
     * @param id
     */
    $scope.deleteTouite = function(id){

        touiteTimelineService.deleteTouite(id).success(function(data, status){

            toastr.success("Touite supprimé !");
            getTouites();
        });
    };

    /**
     * Détermine si l'utilisateur cible est stalké par l'utilisateur connecté
     * @returns {boolean}
     */
    $scope.isStalking = function(){

        if($rootScope.userConnected === undefined || $rootScope.userConnected.idStalking === undefined)
            return false;


        return $rootScope.userConnected.idStalking.indexOf($scope.usernameRequested) !== -1;
    };

    /**
     * Stalke l'utilisateur cible
     */
    $scope.stalk = function(){

        userService.stalk($scope.usernameRequested).success(function(data, status){

            getUser($scope.usernameRequested);

            $rootScope.reloadConnectedUser();
        });
    };

    /**
     * Unstalk l'utilisateur cible
     */
    $scope.unstalk = function(){

        userService.unstalk($scope.usernameRequested).success(function(data, status){

            getUser($scope.usernameRequested);

            $rootScope.reloadConnectedUser();
        });

    };

    /**
     * Détermine la validité du formulaire d'édition
     * @returns {boolean}
     */
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

    /**
     * Affiche le modal d'édition
     */
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

    /**
     * Met à jout l'utilisateur
     */
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

    /**
     * Affichage du modal de suppression
     */
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

    /**
     * Suppression de l'utilisateur courant
     */
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

    //Si un utilisateur est spécifié
    if($routeParams.user !== undefined) {

        //On le récupère
        $scope.usernameRequested = $routeParams.user;

        //On charge les informations de l'utilisateur cible
        getUser($scope.usernameRequested);
        getTouites($scope.usernameRequested);
    }else{

        //Sinon, on charge les données de l'utilisateur courant à son chargement
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