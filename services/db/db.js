var redis = require('redis');
var async = require('async');

var port = "6379";
var host = "192.168.1.56";
//var host = "127.0.0.1";

var clientSetter = redis.createClient(port, host);
var clientGetter = redis.createClient(port, host);

clientSetter.on("connect", function(){
    console.log("SETTER CONNECTED");
});

clientGetter.on("connect", function(){
    console.log("GETTER CONNECTED");
});

var TOUITE = "touite";
var USER = "user";
var NEXT_TOUITE = "next_touite";
var MOTDIESE = "motdiese";

var db = {

    //Constantes
    TOUITE: TOUITE,
    USER: USER,
    MOTDIESE: MOTDIESE,

    clientGetter: clientGetter,
    clientSetter: clientSetter,

    //Fonctions

    getAll: function (type, callback) {

        return clientGetter.smembers(type, callback);
    },

    getNextTouiteIncr: function(callback) {
        clientGetter.incr(NEXT_TOUITE, function(err, data){
            callback(data);
        });
    },

    generateKey: function(type, key, callback) {

        async.series([
            function(asyncCallback){
                if (key !== undefined)
                    asyncCallback(type + ":" + key);
                else {
                    db.getNextTouiteIncr(function(next){
                        asyncCallback(type + ":" + next);
                    });
                }
            }
        ], callback);
    },

    getSuffixKey: function(generatedKey){

        return generatedKey.split(":")[1];
    }
};

module.exports = db;