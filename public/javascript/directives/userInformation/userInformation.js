app.directive('userInformation', ['userService', function (userService) {
    return {
        scope: {
            username: '=',
            modal: '=?',
            light: '=?'
        },

        controller: function ($rootScope, $scope, userService) {

            //light détermine l'affichage de la date

            if($scope.light === undefined)
                $scope.light = false;
            
            userService.getUser($scope.username).success(function(data, status){

                $scope.user = data;
            });

            $scope.hideModal = function(){

                if($scope.modal !== undefined)
                    $scope.modal.hide();
            }

        },

        templateUrl: 'javascript/directives/userInformation/templates/userInformation.html'
    };
}]);
