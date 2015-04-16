/**
 * Created by maxoumime on 13/04/2015.
 */

registerModule.controller('RegisterCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'registerService', function($scope, $rootScope, $location, $routeParams, registerService) {

    if($rootScope.token !== undefined)
        $location.path('/');

    $scope.formRegisterData = {};

    $scope.hover = false;

    $scope.$watch('formRegisterData.id', function(newValue, oldValue) {

        if(newValue !== undefined && newValue.length > 0){

            $scope.formRegistration.username.loading = true;

            registerService.isUsernameAvailable(newValue).success(function(){

                $scope.formRegistration.username.$setValidity('unique', true);

                delete $scope.formRegistration.username.loading;

            }).error(function(data, status){

                if(status === 403)
                    $scope.formRegistration.username.$setValidity('unique', false);

                delete $scope.formRegistration.username.loading;
            });
        }
    });

    $scope.register = function(){

        registerService.register($scope.formRegisterData).success(function(data){

            toastr.success("Inscription réussie !", "Félicitations !");

            $location.path("/login");
        });

    };

    $scope.getFieldValidClasses = function(field){

        var validClasses = ["has-success", "has-feedback"];
        var unvalidClasses = ["has-error", "has-feedback"];

        if(field.$pristine)
            return [];
        else if(field.$valid)
            return validClasses;
        else return unvalidClasses;
    };

    $scope.isFieldValid = function(field){

        return ( field.$valid && field.$dirty )
    };

    $scope.isFieldUnvalid = function(field){

        return ( Object.keys(field.$error).length != 0 && field.$dirty )
    };


}]);