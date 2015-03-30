var authService = require('../services/authService');
var express = require('express');
var router = express.Router();

router.post('/', function(request, response) {

    var userlogin = request.body;

    authService.connect(userlogin.username, userlogin.password, function(cookie){

        if(cookie !== undefined) {
            //response.cookie(authService.cookieName, cookie, {maxAge: 48 * 60 * 60});
            response.send(cookie);
        }
        else response.statusCode = 403;

        response.end();
    });
});

module.exports = router;
