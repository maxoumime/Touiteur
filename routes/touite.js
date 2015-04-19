var express = require('express');
var async = require('async');
var touiteService = require('../services/touiteService');
var userService = require('../services/userService');
var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var router = express.Router();

router.get('/', function(request, response) {

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

        userService.getStalking(user, function(data){

            if(data !== undefined){

                //On veut aussi avoir ses propres touites
                data.push(user);

                var touitesId = [];

                async.each(data, function(userId, callback){

                    userService.getTouites(userId, function(touitesIdStalk){

                        if(touitesIdStalk !== undefined)
                            touitesId = touitesId.concat(touitesIdStalk);

                        callback();
                    });
                }, function(err){

                    var pagination = request.query.pagination;

                    var resultNbr = 10;

                    if(pagination === undefined || isNaN(pagination))
                        pagination = 0;

                    var touitesRetour = touitesId;
                    if(touitesId.length > pagination * resultNbr)
                        touitesRetour = touitesId.slice(pagination * resultNbr, (pagination * resultNbr)+resultNbr);

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

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

router.get('/:idTouite', function(request, response) {

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)) {
        touiteService.getOne(request.params.idTouite, function(err, data){

            if(data != undefined) {
                delete data.motsdiese;
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

router.post('/', function(request, response){

    var token = request.body.token;
    delete request.body.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

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

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

router.delete('/:idTouite', function(request, response){

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

        var idTouite = request.params.idTouite;

        touiteService.getOne(idTouite, function(err, data){

            if(data !== undefined && data !== null && data.authorId === user) {

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

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

function isTouiteValid(touite){

    var valid = true;

    valid &= touite !== undefined;
    valid &= touite.content !== undefined && touite.content.length > 0;

    return valid;
}

module.exports = router;
