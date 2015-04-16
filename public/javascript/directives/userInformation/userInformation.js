app.directive('userInformation', ['userService', function (userService) {
    return {
        scope: {
            username: '=',
            modal: '=?'
        },

        controller: function ($scope, userService) {

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
