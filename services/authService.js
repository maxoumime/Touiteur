var userService = require('./userService');
var crypto = require('crypto');
var uuid = require('node-uuid');

var tokenUser = {};

var algorithm = 'aes256';
var key = 'T0U!T&UR_!S_S&CUR&';

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

                    //Ajout du token dans la liste
                    tokenUser[token] = username;

                    //Renvoi du token
                    callback(token);
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
     * @returns {*}
     */
    getUser: function(token){
        return tokenUser[token];
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
     * @returns {*}
     */
    clearToken: function(token){

        var exists = authService.isConnectedUser(token);

        if(exists)
            delete tokenUser[token];

        return exists;
    },

    /**
     * Permet de savoir si l'utilisateur est connecté ou non par un token
     * @param token
     * @returns {boolean}
     */
    isConnectedUser: function(token){

        return authService.getUser(token) !== undefined;
    }
};

function nocallback(){}

module.exports = authService;