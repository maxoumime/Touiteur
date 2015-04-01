var authService = require('../services/authService');
var express = require('express');
var router = express.Router();

router.post('/', function(request, response) {

    var userlogin = request.body;

    authService.connect(userlogin.username, userlogin.password, function(token){

        if(token !== undefined) {
            response.send(token);
        }
        else response.statusCode = 403;

        response.end();
    });
});

module.exports = router;
