motdieseModule.factory('motdieseService', ['$http', '$rootScope', '$location', function ($http, $rootScope, $location){
    var factory = {};

    factory.getTouites = function(motdiese){

        return $http.get(HOST+'/motdiese/'+motdiese+"?token="+$rootScope.token)

            .error(function(data, status){

                if(status === 403){
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }else if(status === 400){
                    toastr.error("Mauvais motdiese");
                    $location.path('/');
                }
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    factory.getRandom = function(){

        return $http.get(HOST+'/motdiese/random?token='+$rootScope.token)

            .error(function(data, status){

                if(status === 403){
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    return factory;
}]);
