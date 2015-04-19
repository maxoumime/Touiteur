loginModule.factory('loginService', ['$http', function ($http){
    var factory = {};

    /**
     * Authentifie l'utilisateur
     * @param loginData
     * @returns {*}
     */
    factory.login = function(loginData){
        return $http.post(HOST+'/login', loginData)

            .error(function(data, status){

                if(status === 403)
                    toastr.error("Veuillez réessayer", "Mauvais identifiants");
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    /**
     * Détermine la connexion de l'utilisateur
     * @param token
     * @returns {HttpPromise}
     */
    factory.isConnected = function(token){
        return $http.get(HOST+'/login/' + token);
    };

    return factory;
}]);
