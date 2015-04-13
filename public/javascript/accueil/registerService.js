projectModule.factory('projectService', ['$http', '$rootScope', function ($http, $rootScope){
    var factory = {};

    factory.getlist = function(){
        return $http.get('/projects'
        ).error(function(data){
                //toastr.error('Erreur lors du chargement des projets')
            });
    };

    factory.getProject = function(projectId) {
        return $http.get('/projects/' + projectId)
            .error(function(data) {
                toastr.error("Erreur lors de la récupération du projet");
            })
    }
    return factory;
}])
