registerModule.factory('registerService', ['$http', '$rootScope', function ($http, $rootScope){
    var factory = {};

    /**
     * Enregistre un utilisateur
     * @param registrationData
     * @returns {*}
     */
    factory.register = function(registrationData){
        return $http.post(HOST+'/user', registrationData)

            .error(function(data, status){

                if(status === 403)
                    toastr.error("Cet username existe déjà");
                else if(status === 400)
                    toastr.error("Veuillez remplir tous les champs !");
                else if(status === 418)
                    toastr.error("Veuillez fournir un email valide !");
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur serveur");
            });
    };

    /**
     * Détermine si le nom d'utilisateur est disponible
     * @param username
     * @returns {HttpPromise}
     */
    factory.isUsernameAvailable = function(username){

        return $http.get(HOST + '/user/available/'+username);
    };

    return factory;
}]);
