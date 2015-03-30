var express = require('express');
var userService = require('../services/userService');
var authService = require('../services/authService');
var router = express.Router();

/* GET stalking listing for an id. */
router.get('/:idUser', function(request, response, next) {

    var token = request.body.token;
    var user = authService.getUser(token);

    if(token !== undefined && user !== undefined) {

        var idUser = request.params.idUser;

        userService.getStalking(idUser, function(result){
            if(result !== undefined)
                response.send(result);
            else{
                //TODO TROUVER BON CODE HTTP
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
