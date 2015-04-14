loginModule.factory('accueilService', ['$http', '$rootScope', '$location', function ($http, $rootScope, $location){
    var factory = {};

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
    return factory;
}]);
