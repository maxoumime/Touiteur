var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var express = require('express');
var router = express.Router();

router.post('/', function(request, response) {

    var token = request.body.token;

    if(token !== undefined){

        if(!authService.clearToken(token))
            response.statusCode = HTTP_CONSTANTS.NOT_FOUND;

    }else response.statusCode = HTTP_CONSTANTS.FORM_INVALID;

    response.end();

});

module.exports = router;
