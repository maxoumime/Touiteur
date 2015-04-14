var express = require('express');
var userService = require('../services/userService');
var touiteService = require('../services/touiteService');
var authService = require('../services/authService');
var router = express.Router();

router.get('/:id', function(request, response){

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)){

        var idUser = request.params.id;

        userService.getOne(idUser, function(err, data){

            delete data.password;

            response.send(data);

        });

    }else{
        response.statusCode = 403;
        response.end();
    }

});

router.get('/touites/:idUser', function(request, response){

    var token = request.query.token;

    if(token !== undefined && authService.isConnectedUser(token)){

        var idUser = request.params.idUser;

        userService.getTouites(idUser, function(touitesId){

            response.send(touitesId);

        });

    }else{
        response.statusCode = 403;
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
                            response.statusCode = 500;
                            response.end();
                        }
                    });
                } else {
                    response.statusCode = 403;
                    response.end();
                }
            });

        }else{
            response.statusCode = 418;
            response.end();
        }


    } else {
        response.statusCode = 400;
        response.end();
    }

});

router.put('/', function(request, response){

    var token = request.params.token;

    if(token !== undefined && authService.isConnectedUser(token)){

        var user = authService.getUser(token);
        var newUser = request.body;

        userService.getOne(user, function(userDB){

            if(userDB !== null){

                var mergedUser = userDB;

                mergedUser.name  = newUser.name !== undefined ?  newUser.name : userDB.name;
                mergedUser.email = newUser.email !== undefined ? newUser.email : userDB.email;

                if(newUser.oldPassword !== undefined) {

                    var encryptedOldPassword = authService.encrypt(newUser.oldPassword);
                    if( encryptedOldPassword === userDB.password )
                        mergedUser.password = encryptedOldPassword;
                }

                userService.update(user, mergedUser, function(){

                    delete mergedUser.password;
                    response.send(mergedUser);
                });
            }else response.statusCode = 404;
        });


    }else{
        response.statusCode = 403;
        response.end();
    }
});

router.delete('/', function(request, response){

    var token = request.body.token;

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
    valid &= isEmailValid(user.email);

    return valid;
}

function isEmailValid(email){

    return ( email !== undefined &&
    email.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/) !== null);
}

module.exports = router;
