loginModule.factory('accueilService', ['$http', '$rootScope', '$location', function ($http, $rootScope, $location){
    var factory = {};

    factory.postTouite = function(touite){

        touite.token = $rootScope.token;

        return $http.post(host+'/touite', touite)

            .error(function(data, status){

                if(status === 403){
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }else if(status === 509)
                    toastr.error("Longueur du Touite invalide");
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");

            });
    };

    factory.getTouites = function(){
        return $http.get(host+'/touite?token='+$rootScope.token)

            .error(function(data, status){

                if(status === 403) {
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    factory.deleteTouite = function(idTouite){


        return $http.delete(host+'/touite/'+idTouite+"?token=" + $rootScope.token)

            .error(function(data, status){

                if(status === 403) {
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }else if(status === 404){
                    toastr.error("Ce Touite est introuvable", "Introuvable");
                }else if(status === 401){
                    toastr.error("Vous n'êtes pas propriétaire de ce Touite", "Refusé");
                }
            });
    };

    return factory;
}]);
