var motdieseService = require('../services/motdieseService');
var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var express = require('express');
var router = express.Router();

/* Permet de récupérer un mot-dièse aléatoire */
router.get('/random', function(request, response){

    //On récupère le token
    var token = request.query.token;

    //Si le user est connecté
    authService.isConnectedUser(token, function(isConnected){
        if(isConnected) {

            //On récupère un mot-dièse random
            motdieseService.getRandom(function (random) {

                //Si l'on récupère un mot-dièse random, on le renvoie
                if (random !== null)
                    response.send(random);
                //Sinon on renvoie une erreur
                else {
                    response.statusCode = HTTP_CONSTANTS.NO_RESULT;
                    response.end();
                }
            });
        }else{
            response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
            response.end();
        }
    });
});

/* Récupération des touites correspondant au mot-dièse X */
router.get('/:motdiese', function(request, response) {

    //Récupération du mot-dièse
    var motdiese = request.params.motdiese;

    //Récupération du token
    var token = request.query.token;

    //Si l'on a un mot-dièse
    if(motdiese !== undefined){

        //Si le user est connecté
        authService.isConnectedUser(token, function(isConnected){

            if(isConnected) {
                //Récupération des touites par mot-dièse en passant par le service, puis renvoi
                motdieseService.getTouitesId(motdiese, function (err, touitesId) {
                    response.send(touitesId);
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }else{
        response.statusCode = HTTP_CONSTANTS.FORM_INVALID;
        response.end();
    }
});

module.exports = router;
