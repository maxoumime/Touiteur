var express = require('express');
var async = require('async');
var touiteService = require('../services/touiteService');
var userService = require('../services/userService');
var authService = require('../services/authService');
var router = express.Router();

//TODO EN SE BASANT SUR LES STALKING
router.get('/', function(request, response) {

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

        userService.getStalking(user, function(data){

            if(data !== undefined){

                //On veut aussi avoir ses propres touites
                data.push(user);


                var touitesRetour = [];

                async.each(data, function(userId, callback){

                    userService.getTouites(userId, function(touitesId){

                        if(touitesId !== undefined)
                            touitesRetour = touitesRetour.concat(touitesId);

                        callback();
                    });
                }, function(err){
                   response.send(touitesRetour);
                });

            }else{
                response.statusCode = 500;
                response.end();
            }
        });

    }else{
        response.statusCode = 403;
        response.end();
    }
});

router.get('/:idTouite', function(request, response) {

    var token = request.body.token;

    if(token !== undefined && authService.isConnectedUser(token)) {
        touiteService.getOne(request.params.idTouite, function(err, data){

            if(data != undefined)
                response.send(data);
            else {
                response.statusCode = 404;
                response.end();
            }
        });

    }else{
        response.statusCode = 403;
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
            touiteService.add(touite, function(touiteAdded){

                if(touiteAdded !== undefined) {
                    response.send(touiteAdded);
                } else {
                    response.statusCode = 500;
                    response.end();
                }
            });
        }else {
            response.statusCode = 400;
            response.end();
    }

    }else{
        response.statusCode = 403;
        response.end();
    }

});

router.delete('/:idTouite', function(request, response){

    var token = request.body.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

        var idTouite = request.params.idTouite;

        touiteService.getOne(idTouite, function(err, data){

            if(data !== undefined && data !== null && data.authorId === user) {

                touiteService.delete(idTouite, function (result) {
                    if (!result)
                        response.statusCode = 404;

                    response.end();
                });
            }else{
                response.statusCode = 403;
                response.end();
            }

        });

    }else{
        response.statusCode = 403;
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
