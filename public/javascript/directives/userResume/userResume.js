app.directive('userResume', function () {
    return {
        scope: {
            user: '='
        },
        templateUrl: 'javascript/directives/userResume/templates/userResume.html'
    };
});