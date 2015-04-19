var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var express = require('express');
var router = express.Router();

router.post('/', function(request, response) {

    var userlogin = request.body;

    if(isFormOK(userlogin)) {

        authService.connect(userlogin.username, userlogin.password, function (token) {

            if (token !== undefined) {
                response.send(token);
            }else {
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }else{
        response.statusCode = HTTP_CONSTANTS.FORM_INVALID;
        response.end();
    }
});

router.get('/:token', function(request, response){

    var token = request.params.token;

    if(authService.getUser(token) === undefined)
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;

    response.end();
});

function isFormOK(data){

    return ( data.username !== undefined && data.password !== undefined );
}

module.exports = router;
