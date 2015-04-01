var db = require('./db');
var async = require('async');

var setDb = {

    //Fonctions

    getAll: function (type, callback) {

        return db.getAll(type, callback);
    },

    getOne: function (type, key, callback) {

        db.generateKey(type, key, function(generatedKey){

            db.clientGetter.smembers(generatedKey, callback);
        });
    },

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

    update: function (type, key, data, callback) {

        db.generateKey(type, key, function(generatedKey){

            db.clientSetter.hset(generatedKey, data, callback);
        });
    },

    delete: function(type, key, callback){

        return db.delete(type, key, callback);
    }
};

module.exports = setDb;
