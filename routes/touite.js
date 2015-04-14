var express = require('express');
var async = require('async');
var touiteService = require('../services/touiteService');
var userService = require('../services/userService');
var authService = require('../services/authService');
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

                    var touites = [];

                    async.each(touitesId, function(touiteId, callback){

                        touiteService.getOne(touiteId, function(err, touite){

                            if(touite !== undefined && touite !== null){
                                delete touite.motsdiese;
                                touites = touites.concat(touite);
                            }

                            callback();
                        })

                    }, function(err){

                        var pagination = request.query.pagination;

                        if(pagination === undefined || isNaN(pagination))
                            pagination = 10;

                        var touitesRetour = touites;
                        if(touites.length > pagination)
                            touitesRetour = touites.slice(Math.max(touites.length - pagination, 1));

                        response.send(touitesRetour);
                    });
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

    var token = request.query.token;

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

            if(touite.content.length <= 140) {

                touiteService.add(touite, function (touiteAdded) {

                    if (touiteAdded !== undefined) {

                        delete touiteAdded.motsdiese;
                        response.send(touiteAdded);
                    } else {
                        response.statusCode = 500;
                        response.end();
                    }
                });
            }else{
                response.statusCode = 509;
                response.end();
            }
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
