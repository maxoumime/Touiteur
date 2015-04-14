app.directive('touite', function () {
    return {
        scope: {
            content: '=content'
        },
        templateUrl: 'javascript/directives/touite/templates/touite.html'
    };
});