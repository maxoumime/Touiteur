var db = require('./db');
var async = require('async');

var hashDb = {

    //Fonctions

    getAll: function (type, callback) {

        return db.getAll(type, callback);
    },

    getOne: function (type, key, callback) {

        db.generateKey(type, key, function(generatedKey){

            db.clientGetter.hgetall(generatedKey, callback);
        });
    },

    add: function (type, data, callback, key) {

        db.generateKey(type, key, function(generatedKey){

            data.id = db.getSuffixKey(generatedKey);

            async.parallel([
                function(callback){
                    db.clientSetter.hmset(generatedKey, data, callback);
                },
                function(callback){
                    db.clientSetter.sadd(type, db.getSuffixKey(generatedKey), callback);
                }
            ], function(err, results){
                if(results[0] == 'OK' && results[1] == "1"){
                    callback(data);
                }else callback(undefined);
            });
        });

    },

    update: function (type, key, data, callback) {

        db.generateKey(type, key, function(generatedKey){

            db.clientSetter.hmset(generatedKey, data, callback);
        });
    },

    delete: function(type, key, callback){

        return db.delete(type, key, callback);
    }
};

module.exports = hashDb;
