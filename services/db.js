var redis = require('redis');

var port = "6379";
var host = "192.168.1.56";
//var host = "127.0.0.1";

var clientPublisher = redis.createClient(port, host);
var clientSubscriber = redis.createClient(port, host);

var TOUITE = "touite";
var USER = "user";
var NEXT_TOUITE = "next_touite";

// FONCTIONS

function getNextTouiteIncr(){
    return clientSubscriber.incr(NEXT_TOUITE);
}

function getKey(type, key){

    if(key !== undefined)
        return type + ":" + key;
    else {
        var next = getNextTouiteIncr();
        return type + ":" + next;
    }
}

var db = {

    //Constantes
    TOUITE: TOUITE,
    USER: USER,

    //Fonctions

    getAll: function(type){
        var toto = clientSubscriber.smembers(type, function(err, data){
            console.log(data);
            return data;
        });

        console.log(toto)
    },

    getOne: function(type, key){
        var result = clientSubscriber.hgetall(getKey(type, key), function(err, data){
            console.log(data);
        });

        return result;
    },

    add: function(type, data, key){

        var keyGenerated = getKey(type, key);

        //clientPublisher.hmset(keyGenerated, JSON.stringify(data));
        clientPublisher.hmset(keyGenerated, data);

        clientPublisher.sadd(type, key);

        return keyGenerated.split(":")[1];
    },

    update: function(type, key, data){

    },

    delete: function(type, key){
        clientPublisher.del(getKey(type, key));
        clientPublisher.srem(type, key);
    }
};

module.exports = db;
