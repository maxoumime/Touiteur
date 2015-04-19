var express = require('express');
var async = require('async');
var touiteService = require('../services/touiteService');
var userService = require('../services/userService');
var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var router = express.Router();

/* Récupération de tous les touites correspondant à un user en se basant sur les stalking */
router.get('/', function(request, response) {

    //Récupération du token
    var token = request.query.token;

    //Si l'utilisateur est connecté
    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                //Récupération du user
                authService.getUser(token, function(user){

                    //Récupération des stalking du user
                    userService.getStalking(user, function(data){

                        //Si des stalking existent
                        if(data !== undefined){

                            //On veut aussi avoir ses propres touites en plus des touites des stalkings
                            data.push(user);

                            var touitesId = [];

                            //Pour chaque username présent (stalking + user connecté)
                            async.each(data, function(userId, callback){

                                //On récupère leurs touites
                                userService.getTouites(userId, function(touitesIdStalk){

                                    //Si l'utilisateur à déjà touité, on ajoute ses touites
                                    if(touitesIdStalk !== undefined)
                                        touitesId = touitesId.concat(touitesIdStalk);

                                    callback();
                                });
                            }, function(err){

                                //Une fois fini...

                                //On récupère la page recherchée
                                var pagination = request.query.pagination;

                                //Le nombre de résultats par page
                                var resultNbr = 10;

                                //Si aucune page n'a été indiquée, on se base sur la première page
                                if(pagination === undefined || isNaN(pagination))
                                    pagination = 0;

                                //On récupère les touites pour les renvoyer
                                var touitesRetour = touitesId;

                                //Si le nombre de touites excède le nombre de touites recherchés, on ne récupère que ceux qui nous intéressent
                                if(touitesId.length > pagination * resultNbr)
                                    touitesRetour = touitesId.slice(pagination * resultNbr, (pagination * resultNbr)+resultNbr);

                                //On renvoie tous les touites, ainsi que le nombre de touites trouvés
                                response.send({
                                    touites: touitesRetour,
                                    resultNbr: touitesId.length
                                });
                            });

                        }else{
                            response.statusCode = HTTP_CONSTANTS.REDIS_ACCESS_ERROR;
                            response.end();
                        }
                    });
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

/* Récupération d'un touite par son ID */
router.get('/:idTouite', function(request, response) {

    //Récupération du token
    var token = request.query.token;

    //Si l'utilisateur est connecté
    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                //Récupération du touite
                touiteService.getOne(request.params.idTouite, function(err, data){

                    //Si le touite est retrouvé
                    if(data != undefined) {
                        //On supprime les mots-dièse correspondants au touite, ils ne servent pas au client
                        delete data.motsdiese;
                        //Renvoi du touite
                        response.send(data);
                    }else {
                        response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                        response.end();
                    }
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

router.post('/', function(request, response){

    var token = request.body.token;
    delete request.body.token;

    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                authService.getUser(token, function(user){
                    var touite = request.body;

                    touite.authorId = user;

                    if(isTouiteValid(touite)){

                        if(touite.content.length <= 140) {

                            touiteService.add(touite, function (touiteAdded) {

                                if (touiteAdded !== undefined) {

                                    delete touiteAdded.motsdiese;
                                    response.send(touiteAdded);
                                } else {
                                    response.statusCode = HTTP_CONSTANTS.REDIS_ACCESS_ERROR;
                                    response.end();
                                }
                            });
                        }else{
                            response.statusCode = HTTP_CONSTANTS.LENGTH_LIMIT_EXCEEDED;
                            response.end();
                        }
                    }else {
                        response.statusCode = HTTP_CONSTANTS.FORM_INVALID;
                        response.end();
                    }
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

/* Suppression du touite */
router.delete('/:idTouite', function(request, response){

    //Récupération du token
    var token = request.query.token;

    //Si l'utilisateur est connecté
    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                //Récupération du user correspondant au token
                authService.getUser(token, function(user){

                    //Récupération de l'ID du touite
                    var idTouite = request.params.idTouite;

                    //Récupération du touite
                    touiteService.getOne(idTouite, function(err, data){

                        //Si un touite est trouvé, et que l'utilisateur connecté en est bien l'auteur
                        if(data !== undefined && data !== null && data.authorId === user) {

                            //Suppression du touite
                            touiteService.delete(idTouite, function (result) {
                                if (!result)
                                    response.statusCode = HTTP_CONSTANTS.NOT_FOUND;

                                response.end();
                            });
                        }else{
                            response.statusCode = HTTP_CONSTANTS.UNAUTHORISED_ACCESS;
                            response.end();
                        }
                    });
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

/**
 * Détermine si le touite envoyé est valide
 * @param touite
 * @returns {boolean}
 */
function isTouiteValid(touite){

    var valid = true;

    valid &= touite !== undefined;
    valid &= touite.content !== undefined && touite.content.length > 0;

    return valid;
}

module.exports = router;
