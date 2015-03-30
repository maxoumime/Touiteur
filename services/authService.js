var userService = require('./userService');
var crypto = require('crypto');

var cookieUser = {};

//var cookieName = "TOKEN";

var algorithm = 'aes256';
var key = 'T0U!T&UR_!S_S&CUR&';

//NEVER DECRYPT

var authService = {

    //cookieName: cookieName,

    connect: function(username, password, callback){
        userService.getOne(username, function(err, data){

            if(data !== null && data !== undefined){
                if(data.password === authService.encrypt(password)){

                    var encrypted = authService.encrypt(username);

                    cookieUser[encrypted] = username;

                    callback(encrypted);
                }
            }else{
                callback(undefined);
            }
        });
    },

    getUser: function(cookie){
        return cookieUser[cookie];
    },

    encrypt: function(text){
        var cipher = crypto.createCipher(algorithm, key);
        var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    },

    clearCookie: function(cookie){

        delete cookieUser[cookie];
    }
};

module.exports = authService;