var express = require('express');
var userService = require('../services/userService');
var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var router = express.Router();

/* Stalk someone. */
router.post('/:idUser', function(request, response) {

    var token = request.body.token;

    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected)
                authService.getUser(token, function(user){
                    var idUser = request.params.idUser;
                    userService.stalk(user, idUser, function (err, result) {
                        if (result === "ALREADY") {
                            response.statusCode = HTTP_CONSTANTS.CONFLICT;
                        }else if(result !== "OK"){
                            response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                        }
                        response.end();
                    });
                });
            else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

/* Un-stalk someone */
router.delete('/:idUser', function(request, response) {

    var token = request.query.token;

    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                authService.getUser(token, function(user){

                    var idUser = request.params.idUser;
                    userService.unstalk(user, idUser, function(err, result){

                        if(result === "NOT"){
                            response.statusCode = HTTP_CONSTANTS.CONFLICT;
                        }
                        else if(result !== "OK"){
                            response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                        }
                        response.end();
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

module.exports = router;
