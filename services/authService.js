var userService = require('./userService');
var db = require('./db/db');
var crypto = require('crypto');
var uuid = require('node-uuid');
var winston = require('winston');

var algorithm = 'aes256';
var key = 'T0U!T&UR_!S_S&CUR&';
var token_expiration = 3600; // 1h

//NEVER DECRYPT

var authService = {

    /**
     * Connexion d'un utilisateur
     * @param username
     * @param password
     * @param callback
     */
    connect: function(username, password, callback){

        if(callback === undefined) callback = nocallback;

        //Récupération d'un utilisateur
        userService.getOne(username, function(err, data){

            //Si l'utilisateur existe
            if(data !== null && data !== undefined){

                //Si le mot de passe correspond
                if(data.password === authService.encrypt(password)){

                    //Génération d'un token
                    var token = uuid.v4();

                    db.generateKey(db.TOKENS, token, function(generatedKey){
                        //Ajout du token dans la liste
                        db.clientSetter.set(generatedKey, username, function(){

                            winston.info("User " + username + " connecté: " + token);
                            //Renvoi du token
                            callback(token);
                        });

                        //Expiration du token
                        db.clientSetter.expire(generatedKey, token_expiration);
                    });

                }else{
                    callback(undefined);
                }
            }else{
                callback(undefined);
            }
        });
    },

    /**
     * Récupération d'un username par son token
     * @param token
     * @param callback
     */
    getUser: function(token, callback){

        db.generateKey(db.TOKENS, token, function(generatedKey){
            db.clientGetter.get(generatedKey, function(err, data){

                if(data === null)
                    data = undefined;

                callback(data);
            });
        });
    },

    /**
     * Chiffrement d'un texte (ici le mot de passe)
     * @param text
     * @returns {*}
     */
    encrypt: function(text){
        var cipher = crypto.createCipher(algorithm, key);
        var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    },

    /**
     * Supprime le token (déconnecte l'utilisateur) et renvoie si l'utilisateur existe ou non
     * @param token
     * @param callback
     * @returns {*}
     */
    clearToken: function(token, callback){

        authService.isConnectedUser(token, function(exists){

            if(exists)
                db.generateKey(db.TOKENS, token, function(generatedKey){
                    db.clientSetter.del(generatedKey, function(){

                        winston.info("Token " + token + " supprimé");
                        callback(exists);
                    });
                });
            else callback(exists);
        });
    },

    /**
     * Permet de savoir si l'utilisateur est connecté ou non par un token
     * @param token
     * @param callback
     * @returns {boolean}
     */
    isConnectedUser: function(token, callback){

        authService.getUser(token, function(result){

            callback( result !== undefined);
        });
    }
};

function nocallback(){}

module.exports = authService;