/**
 * Created by maxoumime on 13/04/2015.
 */

registerModule.controller('RegisterCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'registerService', function($scope, $rootScope, $location, $routeParams, registerService) {

    if($rootScope.token !== undefined)
        $location.path('/');

    $scope.formRegisterData = {};

    //Détermine le survol de la souris
    $scope.hover = false;

    //Permet de vérifier le changement dans le champ "username"
    $scope.$watch('formRegisterData.id', function(newValue, oldValue) {

        //Si le username existe
        if(newValue !== undefined && newValue.length > 0){

            //Mode de chargement
            $scope.formRegistration.username.loading = true;

            //Appel de service pour vérifier la disponibilité du username
            registerService.isUsernameAvailable(newValue).success(function(){

                //Si oui, on met à jour sa validité
                $scope.formRegistration.username.$setValidity('unique', true);

                delete $scope.formRegistration.username.loading;

            }).error(function(data, status){

                //Sinon, on indique une erreur
                if(status === 403)
                    $scope.formRegistration.username.$setValidity('unique', false);

                delete $scope.formRegistration.username.loading;
            });
        }
    });

    /**
     * Inscription
     */
    $scope.register = function(){

        registerService.register($scope.formRegisterData).success(function(data){

            toastr.success("Inscription réussie !", "Félicitations !");

            $location.path("/login");
        });

    };

    /**
     * Renvoie les classes CSS correspondantes suivant la validité du champ
     * @param field
     * @returns {*}
     */
    $scope.getFieldValidClasses = function(field){

        var validClasses = ["has-success", "has-feedback"];
        var unvalidClasses = ["has-error", "has-feedback"];

        if(field.$pristine)
            return [];
        else if(field.$valid)
            return validClasses;
        else return unvalidClasses;
    };

    /**
     * Détermine la validité du champ
     * @param field
     * @returns {boolean|*}
     */
    $scope.isFieldValid = function(field){

        return ( field.$valid && field.$dirty )
    };

    /**
     * Détermine la non-validité du champ
     * @param field
     * @returns {boolean|*}
     */
    $scope.isFieldUnvalid = function(field){

        return ( Object.keys(field.$error).length != 0 && field.$dirty )
    };


}]);