var db = require('./db');
var async = require('async');

var setDb = {

    //Fonctions

    /**
     * Récupération de tous les sets d'un type
     * @param type
     * @param callback
     * @returns {*}
     */
    getAll: function (type, callback) {

        return db.getAll(type, callback);
    },

    /**
     * Récupération d'un set avec son type et sa clef
     * @param type
     * @param key
     * @param callback
     */
    getOne: function (type, key, callback) {

        db.generateKey(type, key, function(generatedKey){

            db.clientGetter.smembers(generatedKey, callback);
        });
    },

    /**
     * Ajout d'un set suivant son type, et sa clef
     * @param type
     * @param data
     * @param callback
     * @param key
     */
    add: function (type, data, callback, key) {

        db.generateKey(type, key, function(generatedKey){

            data.id = db.getSuffixKey(generatedKey);

            async.parallel([
                function(asyncCallback){
                    db.clientSetter.sadd(generatedKey, data, asyncCallback);
                },
                function(asyncCallback){
                    db.clientSetter.sadd(type, db.getSuffixKey(generatedKey), asyncCallback);
                }
            ], function(err, results){
                if(results[0] == '1' && results[1] == "1"){
                    callback(data);
                }else callback(undefined);
            });
        });

    },

    /**
     * Mise à jour d'un set
     * @param type
     * @param key
     * @param data
     * @param callback
     */
    update: function (type, key, data, callback) {

        db.generateKey(type, key, function(generatedKey){

            if(data.length > 0){
                db.clientSetter.del(generatedKey, callback);
                db.clientSetter.sadd(generatedKey, data, callback);
            }
            else setDb.delete(type, key, callback);
        });
    },

    /**
     * Suppression d'un set
     * @param type
     * @param key
     * @param callback
     * @returns {*}
     */
    delete: function(type, key, callback){

        return db.delete(type, key, callback);
    }
};

module.exports = setDb;
