var db = require('./db');
var async = require('async');
var winston = require('winston');

var hashDb = {

    //Fonctions

    /**
     * Récupère tous les hashs d'un type
     * @param type
     * @param callback
     * @returns {*}
     */
    getAll: function (type, callback) {

        return db.getAll(type, callback);
    },

    /**
     * Récupère un hash d'un type
     * @param type
     * @param key
     * @param callback
     */
    getOne: function (type, key, callback) {

        db.generateKey(type, key, function(generatedKey){

            db.clientGetter.hgetall(generatedKey, callback);
        });
    },

    /**
     * Ajoute un hash suivant un type, un clef, et une donnée
     * @param type
     * @param data
     * @param callback
     * @param key
     */
    add: function (type, data, callback, key) {

        //Génération de la clef
        db.generateKey(type, key, function(generatedKey){

            //Récupération du suffixe de la clef
            data.id = db.getSuffixKey(generatedKey);

            //Traitement parallèle
            async.parallel([
                //Ajout de l'entrée
                function(callback){
                    db.clientSetter.hmset(generatedKey, data, callback);
                },
                //Ajout le l'ID dans la "table"
                function(callback){
                    db.clientSetter.sadd(type, db.getSuffixKey(generatedKey), callback);
                }
            ], function(err, results){
                if(results[0] == 'OK' && results[1] == "1"){
                    winston.info("Ajout du hash " + generatedKey);
                    callback(data);
                }else {
                    winston.error("Ajout hash:" + results[0] + '|' + type + ":" + results[1]);
                    callback(undefined);
                }
            });
        });

    },

    /**
     * Mise à jour d'un hash suivant son type, sa clef
     * @param type
     * @param key
     * @param data
     * @param callback
     */
    update: function (type, key, data, callback) {

        db.generateKey(type, key, function(generatedKey){

            winston.info("Mise à jour du hash " + generatedKey);
            db.clientSetter.hmset(generatedKey, data, callback);
        });
    },

    /**
     * Suppression d'un hash
     * @param type
     * @param key
     * @param callback
     * @returns {*}
     */
    delete: function(type, key, callback){

        return db.delete(type, key, callback);
    }
};

module.exports = hashDb;
