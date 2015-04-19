userModule.factory('userService', ['$http', '$location', '$rootScope', function ($http, $location, $rootScope){
    var factory = {};

    /**
     * Récupération d'un utilisateur par rapport à son ID (ou non)
     * @param user
     */
    factory.getUser = function(user){

        var promise;

        //Si l'ID d'un utilisateur est indiqué, alors on cherche cet utilisateur
        if(user !== undefined)
            promise = $http.get(HOST + '/user/'+user+"?token="+$rootScope.token);
        //Sinon on cherche l'utilisateur courant
        else promise = $http.get(HOST + '/user?token='+$rootScope.token);

        return promise
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
     * Récupère les touites d'un utilisateur
     * @param username
     * @returns {*}
     */
    factory.getTouites = function(username){

        return $http.get(HOST + '/user/touites/'+username+"?token="+$rootScope.token)

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
     * Met à jour un utilisateur
     * @param newUser
     * @returns {*}
     */
    factory.update = function(newUser){

        newUser.token = $rootScope.token;

        return $http.put(HOST + '/user', newUser).error(function(data, status){

            if(status === 403){
                toastr.error("Votre connexion a expiré", "Non authorisé");
                delete $rootScope.token;
                $location.path('/login');
            }else if(status === 401){
                toastr.error("Mot de passe invalide");
            }else if(status === 404){
                toastr.error("Utilisateur introuvable");
                $location.path('/');
            }
            else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
        });
    };

    /**
     * Supprime un utilisateur
     * @returns {*}
     */
    factory.delete = function(){

        return $http.delete(HOST + '/user?token='+$rootScope.token)

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
     * Stalk un utilisateur
     * @param username
     * @returns {*}
     */
    factory.stalk = function(username){

        return $http.post(HOST + '/stalk/'+username, {token: $rootScope.token})

            .error(function(data, status){
                if(status === 403){
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }else if(status === 404){
                    toastr.error("Utilisateur introuvable");
                    $location.path('/');
                }
                else if(status === 406){
                    toastr.error("Vous stalkez déjà cet utilisateur")
                }
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    /**
     * Unstalk un utilisateur
     * @param username
     * @returns {*}
     */
    factory.unstalk = function(username){

        return $http.delete(HOST+'/stalk/'+username+'?token='+$rootScope.token)

            .error(function(data, status){
                if(status === 403){
                    toastr.error("Votre connexion a expiré", "Non authorisé");
                    delete $rootScope.token;
                    $location.path('/login');
                }else if(status === 404){
                    toastr.error("Utilisateur introuvable");
                    $location.path('/');
                }
                else if(status === 406){
                    toastr.error("Vous ne stalkez pas cet utilisateur")
                }
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };

    /**
     * Récupère un utilisateur aléatoire
     */
    factory.getRandom = function(){

        return $http.get(HOST+'/user/random?token='+$rootScope.token)

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
