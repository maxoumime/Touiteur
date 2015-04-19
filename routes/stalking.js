var express = require('express');
var userService = require('../services/userService');
var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var router = express.Router();

/* GET stalking listing for an id. */
router.get('/:idUser', function(request, response) {

    var token = request.query.token;

    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                var idUser = request.params.idUser;

                userService.getStalking(idUser, function(result){
                    if(result !== undefined)
                        response.send(result);
                    else{
                        response.statusCode = HTTP_CONSTANTS.REDIS_ACCESS_ERROR;
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

module.exports = router;
