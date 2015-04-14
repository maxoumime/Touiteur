loginModule.factory('loginService', ['$http', function ($http){
    var factory = {};

    factory.login = function(loginData){
        return $http.post(host+'/login', loginData)

            .error(function(data, status){

                if(status === 403)
                    toastr.error("Veuillez réessayer", "Mauvais identifiants");
                else toastr.error("Veuillez réessayer ultérieurement.", "Erreur de connexion");
            });
    };
    return factory;
}]);
