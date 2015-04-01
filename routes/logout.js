var authService = require('../services/authService');
var express = require('express');
var router = express.Router();

router.post('/', function(request, response) {

    var token = request.body.token;

    if(token !== undefined){

        if(!authService.clearToken(token))
            response.statusCode = 404;

    }else response.statusCode = 400;

    response.end();

});

module.exports = router;
