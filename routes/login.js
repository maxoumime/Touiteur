var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var express = require('express');
var router = express.Router();

/* Login de l'utilisateur */
router.post('/', function(request, response) {

    //Récupération du formulaire de login
    var userlogin = request.body;

    //Si le formulaire de connexion est OK
    if(isFormOK(userlogin)) {

        //On connecte l'utilisateur
        authService.connect(userlogin.username, userlogin.password, function (token) {

            //Si l'on a un token, on l'envoie
            if (token !== undefined) {
                response.send(token);
            }
            //Sinon on refuse la connexion
            else {
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }
    //Sinon on renvoie une erreur
    else{
        response.statusCode = HTTP_CONSTANTS.FORM_INVALID;
        response.end();
    }
});

/* Test de la connexion de l'utilisateur */
router.get('/:token', function(request, response){

    //On récupère le token
    var token = request.params.token;

    //Si le token n'est pas associé à un user, on renvoie une erreur
    if(authService.getUser(token) === undefined)
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;

    response.end();
});

function isFormOK(data){

    return ( data.username !== undefined && data.password !== undefined );
}

module.exports = router;
