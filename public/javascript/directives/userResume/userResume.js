app.directive('userResume', ['$modal', function ($modal) {
    return {
        scope: {
            user: '='
        },
        controller: function ($scope, $modal) {

            $scope.displayModal = function(type){

                $scope.type = type;

                $scope.modal = $modal({scope: $scope, template: 'javascript/directives/userResume/templates/userListModal.html', html: true, show: true});

            }
        },
        templateUrl: 'javascript/directives/userResume/templates/userResume.html'
    };
}]);
