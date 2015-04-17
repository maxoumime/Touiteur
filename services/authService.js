var userService = require('./userService');
var crypto = require('crypto');
var uuid = require('node-uuid');

var tokenUser = {};

var algorithm = 'aes256';
var key = 'T0U!T&UR_!S_S&CUR&';

//NEVER DECRYPT

var authService = {

    connect: function(username, password, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(username, function(err, data){

            if(data !== null && data !== undefined){
                if(data.password === authService.encrypt(password)){

                    var token = uuid.v4();

                    tokenUser[token] = username;

                    callback(token);
                }else{

                    callback(undefined);
                }
            }else{
                callback(undefined);
            }
        });
    },

    getUser: function(token){
        return tokenUser[token];
    },

    encrypt: function(text){
        var cipher = crypto.createCipher(algorithm, key);
        var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    },

    clearToken: function(token){

        var exists = authService.isConnectedUser(token);

        if(exists)
            delete tokenUser[token];

        return exists;
    },

    isConnectedUser: function(token){

        return authService.getUser(token) !== undefined;
    }
};

function nocallback(){}

module.exports = authService;