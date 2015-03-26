var redis = require('redis');

var port = "6379";
var host = "127.0.0.1";

var clientPublisher = redis.createClient(port, host);
var clientSubscriber = redis.createClient(port, host);

var TOUITE = "TOUITE";
var USER = "USER";

module.exports = {

    //Constantes
    TOUITE: TOUITE,
    USER: USER,

    //Fonctions
    getAll: function(type){
        return type === TOUITE ? [{
            "touite": "BLABLABLA"
        }] : [];
    },
    
    getOne: function(type, key){

    },
    
    add: function(type, data){
        //clientPublisher.hmset()
    },
    
    update: function(type, key, data){

    },
    
    deleteOne: function(type, key){

    }
};
