touitetimelineModule.factory('touiteTimelineService', ['$http', '$rootScope', '$location', function ($http, $rootScope, $location){
    var factory = {};

    /**
     * Poste un touite
     * @param touite
     * @returns {*}
     */
    factory.postTouite = function(touite){

        touite.token = $rootScope.token;

        return $http.post(HOST+'/touite', touite)

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

    /**
     * Récupère un touite par son ID
     * @param id
     * @returns {*}
     */
    factory.getTouite = function(id){

        return $http.get(HOST+'/touite/'+id+"?token="+$rootScope.token)

            .error(function(data, status){
                if(status === 403){
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }else if(status === 404){
                    toastr.error("Utilisateur introuvable");
                    $location.path('/');
                }
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    /**
     * Récupère les touites par rapport à un utilisateur (token) et la pagination
     * @param page
     * @returns {*}
     */
    factory.getTouites = function(page){

        var url = HOST+'/touite?token='+$rootScope.token;

        //Si une page est indiquée, on l'ajoute à la requête
        if(page !== undefined)
            url += "&pagination=" + page;

        return $http.get(url)

            .error(function(data, status){

                if(status === 403) {
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    /**
     * Suppression d'un touite
     * @param idTouite
     * @returns {*}
     */
    factory.deleteTouite = function(idTouite){


        return $http.delete(HOST+'/touite/'+idTouite+"?token=" + $rootScope.token)

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
