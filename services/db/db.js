var redis = require('redis');
var async = require('async');
var uuid = require('node-uuid');

var port = "6379";
var host = "192.168.1.21";
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

    delete: function (type, key, callback) {

        db.generateKey(type, key, function(generatedKey){
            async.parallel([
                function (callback) {
                    clientSetter.del(generatedKey, callback)
                },
                function (callback) {
                    clientSetter.srem(type, db.getSuffixKey(generatedKey), callback)
                }
            ], function (err, results) {
                callback(results[0] == 1 && results[1] == 1);
            });
        });
    },

    generateKey: function(type, key, callback) {

        if (key !== undefined)
            callback(type + ":" + key);
        else {
            callback(type + ":" + uuid.v4());
        }
    },

    getSuffixKey: function(generatedKey){

        return generatedKey.split(":")[1];
    }
};

module.exports = db;
