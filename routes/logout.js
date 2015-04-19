var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var express = require('express');
var router = express.Router();

/* Lors de l'appel de déconnexion */
router.post('/', function(request, response) {

    //On récupère le token
    var token = request.body.token;

    //Si un token est bien présent
    if(token !== undefined){

        //On supprime le token, s'il n'existe pas, on renvoie une erreur
        authService.clearToken(token, function(exists){
            if(!exists)
               response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
            response.end();
        });

    }else {
        response.statusCode = HTTP_CONSTANTS.FORM_INVALID;
        response.end();
    }
});

module.exports = router;
