var express = require('express');
var userService = require('../services/userService');
var authService = require('../services/authService');
var router = express.Router();

/* GET stalkers listing by id. */
router.get('/:idUser', function(request, response, next) {

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var idUser = request.params.idUser;

        userService.getStalkers(idUser, function(result){
            if(result !== undefined)
                response.send(result);
            else{
                //TODO TROUVER BON HTTP CODE
                response.statusCode = 500;
                response.end();
            }
        });

    }else{
        response.statusCode = 403;
        response.end();
    }
});

module.exports = router;
