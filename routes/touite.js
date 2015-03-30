var express = require('express');
var touiteService = require('../services/touiteService');
var authService = require('../services/authService');
var router = express.Router();

//TODO FIND
//TODO EN SE BASANT SUR LES STALKING
router.get('/', function(request, response) {

    var token = request.body.token;
    var user = authService.getUser(token);

    if(token !== undefined && user !== undefined) {

        touiteService.getAll(function(err,data){
            response.send(data);
        });

    }else{
        response.statusCode = 403;
        response.end();
    }
});

router.get('/:idTouite', function(request, response) {

    var token = request.body.token;
    var user = authService.getUser(token);

    if(token !== undefined && user !== undefined) {
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
    var user = authService.getUser(token);

    if(token !== undefined && user !== undefined) {

        var touite = request.body;

        touite.authorId = user;

        if(isTouiteValid(touite)){
            touiteService.add(touite, function(touiteAdded){

                if(touiteAdded !== undefined)
                    response.send(touiteAdded);
                else {
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
    var user = authService.getUser(token);

    if(token !== undefined && user !== undefined) {

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
    valid &= touite.content !== undefined;

    return valid;
}

module.exports = router;
