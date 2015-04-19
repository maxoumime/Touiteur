var express = require('express');
var userService = require('../services/userService');
var touiteService = require('../services/touiteService');
var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var router = express.Router();


router.get('/random', function(request, response){

    var token = request.query.token;

    if(authService.isConnectedUser(token))
        userService.getRandom(authService.getUser(token), function(random){

            if(random !== null)
                response.send(random);
            else{
                response.statusCode = HTTP_CONSTANTS.NO_RESULT;
                response.end();
            }
        });
    else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

router.get('/', function(request, response){

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)){

        var idUser = authService.getUser(token);

        userService.getOne(idUser, function(err, data){

            if(data !== null){

                delete data.password;

                if(data.idTouites !== undefined)
                    data.idTouites = JSON.parse(data.idTouites);

                if(data.idStalkers !== undefined)
                    data.idStalkers = JSON.parse(data.idStalkers);

                if(data.idStalking !== undefined)
                    data.idStalking = JSON.parse(data.idStalking);

                response.send(data);
            }else{
                response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                response.end();
            }

        });

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

router.get('/:id', function(request, response){

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)){

        var idUser = request.params.id;

        userService.getOne(idUser, function(err, data){

            if(data !== null){

                delete data.password;

                if(data.idTouites !== undefined)
                    data.idTouites = JSON.parse(data.idTouites);

                if(data.idStalkers !== undefined)
                    data.idStalkers = JSON.parse(data.idStalkers);

                if(data.idStalking !== undefined)
                    data.idStalking = JSON.parse(data.idStalking);

                response.send(data);
            }else{
                response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                response.end();
            }

        });

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

router.get('/touites/:idUser', function(request, response){

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)){

        var idUser = request.params.idUser;

        userService.getTouites(idUser, function(touitesId){

            if(touitesId !== null){
                response.send(touitesId);
            }else{
                response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                response.end();
            }
        });

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

router.post('/', function(request, response){

    var userPost = request.body;

    if (isUserValid(userPost)) {

        if(isEmailValid(userPost.email)) {

            userService.doesExist(userPost.id, function (does) {

                if (!does) {
                    userPost.password = authService.encrypt(userPost.password);

                    userService.add(userPost, function (result) {
                        if (result !== undefined) {
                            delete result.password;
                            response.send(result);
                        } else {
                            response.statusCode = HTTP_CONSTANTS.REDIS_ACCESS_ERROR;
                            response.end();
                        }
                    });
                } else {
                    response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                    response.end();
                }
            });

        }else{
            response.statusCode = HTTP_CONSTANTS.INVALID_EMAIL;
            response.end();
        }


    } else {
        response.statusCode = HTTP_CONSTANTS.FORM_INVALID;
        response.end();
    }

});

router.put('/', function(request, response){

    var token = request.body.token;

    if(token !== undefined && authService.isConnectedUser(token)){

        var user = authService.getUser(token);
        var newUser = request.body;

        userService.getOne(user, function(err, userDB){

            if(userDB !== null){

                var mergedUser = userDB;

                mergedUser.name  = newUser.name !== undefined ?  newUser.name : userDB.name;

                if(newUser.email !== undefined)
                    if(isEmailValid(newUser.email))
                        mergedUser.email = newUser.email !== undefined ? newUser.email : userDB.email;
                    else{
                        response.statusCode = HTTP_CONSTANTS.INVALID_EMAIL;
                        response.end();
                        return;
                    }

                if(newUser.oldPassword !== undefined) {

                    var encryptedOldPassword = authService.encrypt(newUser.oldPassword);
                    if( encryptedOldPassword === userDB.password )
                        mergedUser.password = authService.encrypt(newUser.password);
                    else{
                        response.statusCode = HTTP_CONSTANTS.UNAUTHORISED_ACCESS;
                        response.end();
                        return;
                    }
                }

                userService.update(user, mergedUser, function(){

                    delete mergedUser.password;
                    response.send(mergedUser);
                });

            }else{
                response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                response.end();
            }
        });


    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

router.delete('/', function(request, response){

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)) {

        var user = authService.getUser(token);

        userService.getOne(user, function(me){

           if(me !== null){

               var touites = me.idTouites !== undefined ? JSON.parse(me.idTouites) : [];
               for(var touiteIndex in touites)
                   touiteService.delete(touites[touiteIndex], function(){});

               var stalkers = me.idStalkers !== undefined ? JSON.parse(me.idStalkers) : [];
               for(var stalkerIndex in stalkers)
                    userService.unstalk(stalkers[stalkerIndex], user, function(){});

               var stalking = me.idStalking !== undefined ? JSON.parse(me.idStalking) : [];
               for(var stalkingIndex in stalking)
                    userService.unstalk(user, stalking[stalkingIndex], function(){});
           }

        });

        userService.delete(user, function(result){

            if(!result)
                response.statusCode = HTTP_CONSTANTS.NOT_FOUND;

            response.end();
        });

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

router.get('/available/:username', function(request, response){
    var username = request.params.username;

    userService.doesExist(username, function(does){

        if(does)
            response.statusCode = HTTP_CONSTANTS.FORBIDDEN;

        response.end();

    });
});

function isUserValid(user){

    var valid = true;

    valid &= user !== undefined;
    valid &= user.id !== undefined;
    valid &= user.name !== undefined;
    valid &= user.password !== undefined;
    valid &= isEmailValid(user.email);

    return valid;
}

function isEmailValid(email){

    return ( email !== undefined &&
    email.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/) !== null);
}

module.exports = router;
