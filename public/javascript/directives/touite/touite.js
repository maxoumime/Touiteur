//Affiche un touite
app.directive('touite', function () {
    return {
        scope: {
            content: '=',
            username: '=',
            deleteTouite: '&'
        },
        templateUrl: 'javascript/directives/touite/templates/touite.html'
    };
});