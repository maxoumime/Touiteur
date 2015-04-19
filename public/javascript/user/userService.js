userModule.factory('userService', ['$http', '$location', '$rootScope', function ($http, $location, $rootScope){
    var factory = {};

    factory.getUser = function(user){

        var promise;

        if(user !== undefined)
            promise = $http.get(HOST + '/user/'+user+"?token="+$rootScope.token);
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
