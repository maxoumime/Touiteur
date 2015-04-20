var express = require('express');
var userService = require('../services/userService');
var touiteService = require('../services/touiteService');
var authService = require('../services/authService');
var HTTP_CONSTANTS = require('./http_constants');
var router = express.Router();

/* Récupère un utilisateur aléatoire, basé sur les followers de l'utilisateur courant */
router.get('/random', function(request, response){

    //Récupère le token
    var token = request.query.token;

    //Si l'utilisateur est connecté
    authService.isConnectedUser(token, function(exists){

        if(exists){

            authService.getUser(token, function(user){
                //On récupère un utilisateur aléatoire
                userService.getRandom(user, function(random){

                    //S'il y en a bien un à afficher, en l'envoie
                    if(random !== null)
                        response.send(random);
                    else{
                        response.statusCode = HTTP_CONSTANTS.NO_RESULT;
                        response.end();
                    }
                });
            });

        }else{
            response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
            response.end();
        }
    });

});

/* Récupération de l'utilisateur connecté */
router.get('/', function(request, response){

    //Récupération du token
    var token = request.query.token;

    //Si l'utilisateur est connecté
    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){

                //Récupération du username
                authService.getUser(token, function(idUser){

                    //Récupération de l'utilisateur
                    userService.getOne(idUser, function(err, data){

                        //Si l'utilisateur existe
                        if(data !== null){

                            //Suppression du mot de passe, on ne veut pas l'envoyer au client !
                            delete data.password;

                            //Si les différents tableaux sont présents avec l'utilisateur, on les parse
                            if(data.idTouites !== undefined)
                                data.idTouites = JSON.parse(data.idTouites);

                            if(data.idStalkers !== undefined)
                                data.idStalkers = JSON.parse(data.idStalkers);

                            if(data.idStalking !== undefined)
                                data.idStalking = JSON.parse(data.idStalking);

                            //Envoi de l'utilisateur
                            response.send(data);
                        }else{
                            response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                            response.end();
                        }

                    });
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });
    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

/* Récupération d'un utilisateur avec son ID */
router.get('/:id', function(request, response){

    //Récupération du token
    var token = request.query.token;

    //Si l'utilisateur est connecté
    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                //Récupération de l'ID de l'utilisateur
                var idUser = request.params.id;

                //On récupère l'utilisateur
                userService.getOne(idUser, function(err, data){

                    //Si l'utilisateur existe
                    if(data !== null){

                        //Suppression du mot de passe, on ne veut pas l'envoyer au client
                        delete data.password;

                        //Si les différents tableaux sont présents avec l'utilisateur, on les parse
                        if(data.idTouites !== undefined)
                            data.idTouites = JSON.parse(data.idTouites);

                        if(data.idStalkers !== undefined)
                            data.idStalkers = JSON.parse(data.idStalkers);

                        if(data.idStalking !== undefined)
                            data.idStalking = JSON.parse(data.idStalking);

                        //On renvoie l'utilisateur
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
    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

/* Récupération des touites d'un user */
router.get('/touites/:idUser', function(request, response){

    var token = request.query.token;

    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
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
    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }

});

/* Inscription d'un utilisateur */
router.post('/', function(request, response){

    var userPost = request.body;

    //Si le nouvel utilisateur est valide
    if (isUserValid(userPost)) {

        //Si le mail est aussi valide
        if(isEmailValid(userPost.email)) {

            //Test de l'existence de l'utilisateur
            userService.doesExist(userPost.id, function (does) {

                //S'il n'existe pas, on l'ajoute
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

/* Modification de l'utilisateur */
router.put('/', function(request, response){

    //Récupération du token
    var token = request.body.token;

    //Si l'utilisateur est connecté
    if(token !== undefined){

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                //Récupération du username de l'utilisateur connecté
                authService.getUser(token, function(user){

                    var newUser = request.body;

                    //Récupération de l'utilisateur
                    userService.getOne(user, function(err, userDB){

                        //Si l'utilisateur existe bien
                        if(userDB !== null){

                            var mergedUser = userDB;

                            //Merge du nom de l'utilisateur si un nouveau nom est spécifié
                            mergedUser.name  = newUser.name !== undefined && newUser.name.length > 0 ? newUser.name : userDB.name;

                            //Si un email a été changé, et qu'il est valide, on le récupère
                            if(newUser.email !== undefined)
                                if(isEmailValid(newUser.email))
                                    mergedUser.email = newUser.email !== undefined ? newUser.email : userDB.email;
                                else{
                                    response.statusCode = HTTP_CONSTANTS.INVALID_EMAIL;
                                    response.end();
                                    return;
                                }

                            //Si l'ancien mot de passe a été spécifié
                            if(newUser.oldPassword !== undefined) {

                                //On le chiffre pour le comparer
                                var encryptedOldPassword = authService.encrypt(newUser.oldPassword);

                                //Si le mot de passe est bon, on récupère le nouveau mot de passe chiffré
                                if( encryptedOldPassword === userDB.password )
                                    mergedUser.password = authService.encrypt(newUser.password);
                                else{
                                    response.statusCode = HTTP_CONSTANTS.UNAUTHORISED_ACCESS;
                                    response.end();
                                    return;
                                }
                            }

                            //Mise à jour de l'utilisateur avec les nouvelles infos, puis renvoi
                            userService.update(user, mergedUser, function(){
                                delete mergedUser.password;
                                response.send(mergedUser);
                            });

                        }else{
                            response.statusCode = HTTP_CONSTANTS.NOT_FOUND;
                            response.end();
                        }
                    });
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });


    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

/* Suppression de l'utilisateur */
router.delete('/', function(request, response){

    //Récupération du token
    var token = request.query.token;

    //Si l'utilisateur est connecté
    if(token !== undefined) {

        authService.isConnectedUser(token, function(isConnected){

            if(isConnected){
                //Récupération du username de l'utilisateur connecté
                authService.getUser(token, function(user){

                    //Récupération de l'utilisateur
                    userService.getOne(user, function(me){

                        //Si l'utilisateur existe
                        if(me !== null){

                            //Suppression de tous les touites de l'utilisateur
                            var touites = me.idTouites !== undefined ? JSON.parse(me.idTouites) : [];
                            for(var touiteIndex in touites)
                                touiteService.delete(touites[touiteIndex]);

                            //"Un-stalk" de ses stalkers
                            var stalkers = me.idStalkers !== undefined ? JSON.parse(me.idStalkers) : [];
                            for(var stalkerIndex in stalkers)
                                userService.unstalk(stalkers[stalkerIndex], user);

                            //"Un-stalk" de ses stalking
                            var stalking = me.idStalking !== undefined ? JSON.parse(me.idStalking) : [];
                            for(var stalkingIndex in stalking)
                                userService.unstalk(user, stalking[stalkingIndex]);
                        }

                    });

                    //Suppression de l'utilsateur
                    userService.delete(user, function(result){

                        if(!result)
                            response.statusCode = HTTP_CONSTANTS.NOT_FOUND;

                        response.end();
                    });
                });
            }else{
                response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
                response.end();
            }
        });

    }else{
        response.statusCode = HTTP_CONSTANTS.FORBIDDEN;
        response.end();
    }
});

/* Permet de savoir si le nom d'utilisateur est disponible */
router.get('/available/:username', function(request, response){
    var username = request.params.username;

    userService.doesExist(username, function(does){

        if(does)
            response.statusCode = HTTP_CONSTANTS.FORBIDDEN;

        response.end();

    });
});

/**
 * Permet de savoir si l'utilisateur demandé est valide
 * @param user
 * @returns {boolean}
 */
function isUserValid(user){

    var valid = true;

    valid &= user !== undefined;
    valid &= user.id !== undefined;
    valid &= user.name !== undefined;
    valid &= user.password !== undefined;
    valid &= user.email !== undefined;

    return valid;
}

/**
 * Permet de savoir si l'email est valide
 * @param email
 * @returns {boolean}
 */
function isEmailValid(email){

    return ( email !== undefined &&
    email.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/) !== null);
}

module.exports = router;
