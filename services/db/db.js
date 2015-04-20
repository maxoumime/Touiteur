var redis = require('redis');
var async = require('async');
var uuid = require('node-uuid');

var port = "6379";
//var host = "192.168.1.21";
var host = "127.0.0.1";

var clientSetter = redis.createClient(port, host);
var clientGetter = redis.createClient(port, host);

clientSetter.on("connect", function(){
    console.log("SETTER CONNECTED");
});

clientGetter.on("connect", function(){
    console.log("GETTER CONNECTED");
});

//"TABLES"
var TOUITE = "touite";
var USER = "user";
var MOTDIESE = "motdiese";
var TOKENS = "tokens";

var db = {

    //Constantes
    TOUITE: TOUITE,
    USER: USER,
    MOTDIESE: MOTDIESE,
    TOKENS: TOKENS,

    clientGetter: clientGetter,
    clientSetter: clientSetter,

    //Fonctions

    /**
     * Récupère les IDs d'un certain type
     * @param type
     * @param callback
     */
    getAll: function (type, callback) {

        return clientGetter.smembers(type, callback);
    },

    /**
     * Supprime un élément d'un certain type
     * @param type
     * @param key
     * @param callback
     */
    delete: function (type, key, callback) {

        //Génération de la clef suivant le type et l'id
        db.generateKey(type, key, function(generatedKey){
            //Traitement parallèle
            async.parallel([
                function (callback) {
                    //Suppression de la clef
                    clientSetter.del(generatedKey, callback)
                },
                function (callback) {
                    //Suppression de l'ID sur la "table"
                    clientSetter.srem(type, db.getSuffixKey(generatedKey), callback)
                }
            ], function (err, results) {
                callback(results[0] == 1 && results[1] == 1);
            });
        });
    },

    /**
     * Génération de la clef suivant le type et la clef
     * @param type
     * @param key
     * @param callback
     */
    generateKey: function(type, key, callback) {

        if (key !== undefined)
            callback(type + ":" + key);
        else {
            callback(type + ":" + uuid.v4());
        }
    },

    /**
     * Récupère le suffixe d'une clef générée
     * @param generatedKey
     * @returns {*}
     */
    getSuffixKey: function(generatedKey){

        return generatedKey.split(":")[1];
    }
};

module.exports = db;
