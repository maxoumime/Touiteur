var motdieseService = require('../services/motdieseService');
var authService = require('../services/authService');
var express = require('express');
var router = express.Router();

router.get('/random', function(request, response){

    var token = request.query.token;

    if(authService.isConnectedUser(token))
        motdieseService.getRandom(function(random){

            if(random !== null)
                response.send(random);
            else{
                response.statusCode = 204;
                response.end();
            }
        });
    else{
        response.statusCode = 403;
        response.end();
    }
});

router.get('/:motdiese', function(request, response) {

    var motdiese = request.params.motdiese;

    var token = request.query.token;

    if(motdiese !== undefined){
        if(authService.isConnectedUser(token)) {
            motdieseService.getTouitesId(motdiese, function (err, touitesId) {

                response.send(touitesId);
            });
        }else{
            response.statusCode = 403;
            response.end();
        }

    }else{
        response.statusCode = 400;
        response.end();
    }
});

module.exports = router;
