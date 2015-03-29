var redis = require('redis');
var async = require('async');

var port = "6379";
var host = "192.168.1.56";
//var host = "127.0.0.1";

var clientPublisher = redis.createClient(port, host);
var clientSubscriber = redis.createClient(port, host);

var TOUITE = "touite";
var USER = "user";
var NEXT_TOUITE = "next_touite";

// FONCTIONS

function generateKey(type, key, callback) {

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

}

function getSuffixKey(generatedKey){

    return generatedKey.split(":")[1];
}

var db = {

    //Constantes
    TOUITE: TOUITE,
    USER: USER,

    //Fonctions

    getAll: function (type, callback) {

        return clientSubscriber.smembers(type, callback);
    },

    getOne: function (type, key, callback) {

        generateKey(type, key, function(generatedKey){

            clientSubscriber.hgetall(generatedKey, callback);
        });
    },

    add: function (type, data, callback, key) {

        generateKey(type, key, function(generatedKey){

            data.id = getSuffixKey(generatedKey);

            async.parallel([
                function(callback){
                    clientPublisher.hmset(generatedKey, data, callback);
                },
                function(callback){
                    clientPublisher.sadd(type, getSuffixKey(generatedKey), callback);
                }
            ], function(err, results){
                if(results[0] == 'OK' && results[1] == "1"){
                    callback(data);
                }else callback(undefined);
            });
        });

    },

    update: function (type, key, data, callback) {

        generateKey(type, key, function(generatedKey){

            clientPublisher.hmset(generatedKey, data, callback);
        });
    },

    delete: function (type, key, callback) {

        generateKey(type, key, function(generatedKey){
            async.parallel([
                function (callback) {
                    clientPublisher.del(generatedKey, callback)
                },
                function (callback) {
                    clientPublisher.srem(type, getSuffixKey(generatedKey), callback)
                }
            ], function (err, results) {
                callback(results[0] == 1 && results[1] == 1);
            });
        });
    },

    getNextTouiteIncr: function(callback) {
        clientSubscriber.incr(NEXT_TOUITE, function(err, data){
            callback(data);
        });
    }
};

module.exports = db;
