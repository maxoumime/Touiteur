var db = require('./db');
var async = require('async');

var userService = {

    //Fonctions
    getAll: function(callback) {
        return db.getAll(db.USER, callback);
    },

    getOne: function (key, callback) {
        return db.getOne(db.USER, key, callback);
    },

    add: function (data, callback) {
        return db.add(db.USER, data, callback, data.id);
    },

    update: function(key, data, callback){
        return db.update(db.USER, key, data, callback);
    },

    delete: function (key, callback) {
        db.delete(db.USER, key, callback);
    },

    stalk: function (keyMe, keyTarget) {
        async.parallel([
            function(callback) {
                userService.getOne(keyMe, callback)
            },
            function(callback){
                userService.getOne(keyTarget, callback)
            }
        ], function(err, results){

            //Traitement

            var me = results[0];
            var target = results[1];

            if(me !== undefined && target !== undefined){

                var stalking;
                if(me.idStalking === undefined){
                    stalking = [];
                }else stalking = JSON.parse(me.idStalking);

                stalking.push(target.id);

                me.idStalking = JSON.stringify(stalking);

                var stalkers;
                if(target.idStalkers === undefined){
                    stalkers = [];
                }else stalkers = JSON.parse(target.idStalkers);

                stalkers.push(me.id);

                target.idStalkers = JSON.stringify(stalkers);

                userService.update(me.id, me, function(result){});
                userService.update(target.id, target, function(result){});
            }
        });

    },

    unstalk: function(keyMe, keyTarget) {
        async.parallel([
            function(callback) {
                userService.getOne(keyMe, callback)
            },
            function(callback){
                userService.getOne(keyTarget, callback)
            }
        ], function(err, results){
            //Traitement

            var me = results[0];
            var target = results[1];

            if(me !== undefined && target !== undefined){

                var stalking;
                if(me.idStalking === undefined){
                    stalking = [];
                }else stalking = JSON.parse(me.idStalking);

                stalking.splice(stalking.indexOf(target.id), 1);

                me.idStalking = JSON.stringify(stalking);

                var stalkers;
                if(target.idStalkers === undefined){
                    stalkers = [];
                }else stalkers = JSON.parse(target.idStalkers);

                stalkers.splice(stalkers.indexOf(me.id), 1);

                target.idStalkers = JSON.stringify(stalkers);

                userService.update(me.id, me);
                userService.update(target.id, target);
            }
        });

    },

    getStalking: function(keyMe, callback){
        userService.getOne(keyMe, function(err, me){
            if(me !== undefined)
                callback( me.idStalkers !== undefined ? JSON.parse(me.idStalkers) : [] );
            else callback(undefined);
        });

    },

    getStalkers: function(keyMe, callback){
        userService.getOne(keyMe, function(err, me){
            if(me !== undefined)
                callback(me.idStalking !== undefined ? JSON.parse(me.idStalking) : [] );
            else callback(undefined);
        });

    }
};

module.exports = userService;
