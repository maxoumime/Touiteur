var express = require('express');
var userService = require('../services/userService');
var authService = require('../services/authService');
var router = express.Router();

//TODO SEVERAL ERROR CODES (MYSELF, ALREADY, NON EXIST)

/* Stalk someone. */
router.post('/:idUser', function(request, response) {

    var token = request.body.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

        var idUser = request.params.idUser;
        userService.stalk(user, idUser, function (err, result) {
            if (result !== "OK") {
                response.statusCode = 404;
            }
            response.end();
        });
    }else{
        response.statusCode = 403;
        response.end();
    }
});

/* Un-stalk someone */
router.delete('/:idUser', function(request, response) {

    var token = request.body.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

        var idUser = request.params.idUser;
        userService.unstalk(user, idUser, function(err, result){
            if(result !== "OK"){
                response.statusCode = 404;
            }
            response.end();
        });

    }else{
        response.statusCode = 403;
        response.end();
    }
});

module.exports = router;
