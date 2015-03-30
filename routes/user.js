var express = require('express');
var userService = require('../services/userService');
var authService = require('../services/authService');
var router = express.Router();

//TODO UPDATE USER

/*
router.get('/', function(request, response, next) {

    userService.getAll(function(err, data){
        response.send(data);
    });

});
*/

/*
router.get('/:idUser', function(request, response, next){

    userService.getOne(request.params.idUser, function(err, data){
        response.send(data);
    });
});
*/

router.post('/', function(request, response){

    var userPost = request.body;

    if (isUserValid(userPost)) {

        userService.doesExist(userPost.id, function(does){

            if(does) {
                userPost.password = authService.encrypt(userPost.password);

                userService.add(userPost, function (result) {
                    if (result !== undefined)
                        response.send(result);
                    else {
                        response.statusCode = 500;
                        response.end();
                    }
                });
            }else{
                response.statusCode = 403;
                response.end();
            }
        });


    } else {
        response.statusCode = 400;
        response.end();
    }

});

//TODO SUPPRIMER TOUITES CORRESPONDANTS
router.delete('/', function(request, response){

    var token = request.body.token;
    var user = authService.getUser(token);

    if(token !== undefined && user !== undefined) {

        userService.delete(user, function(result){

            if(!result)
                response.statusCode = 404;

            response.end();
        });

    }else{
        response.statusCode = 403;
        response.end();
    }
});

router.get('/available/:username', function(request, response){
    var username = request.params.username;

    userService.doesExist(username, function(does){

        if(does)
            response.statusCode = 403;

        response.end();

    });
});

function isUserValid(user){

    var valid = true;

    valid &= user !== undefined;
    valid &= user.id !== undefined;
    valid &= user.name !== undefined;
    valid &= user.password !== undefined;

    return valid;
}

module.exports = router;
