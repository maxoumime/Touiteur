loginModule.factory('loginService', ['$http', function ($http){
    var factory = {};

    factory.login = function(loginData){
        return $http.post('/login', loginData)

            .error(function(data, status){

                if(status === 403)
                    toastr.error("Mauvais identifiants, veuillez réessayer");
                else toastr.error("Impossible de se connecter.");
            });
    };
    return factory;
}]);
