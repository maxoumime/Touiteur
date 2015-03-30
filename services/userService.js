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

    stalk: function (keyMe, keyTarget, callback) {
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

            if(me !== undefined && me != null && target !== undefined && target != null && me.id !== target.id){

                var stalking;
                if(me.idStalking === undefined){
                    stalking = [];
                }else stalking = JSON.parse(me.idStalking);

                if(stalking.indexOf(target.id) != -1) {
                    callback(undefined);
                }else{
                    stalking.push(target.id);

                    me.idStalking = JSON.stringify(stalking);

                    var stalkers;
                    if (target.idStalkers === undefined) {
                        stalkers = [];
                    } else stalkers = JSON.parse(target.idStalkers);

                    stalkers.push(me.id);

                    target.idStalkers = JSON.stringify(stalkers);

                    userService.update(me.id, me, callback);
                    userService.update(target.id, target, callback);
                }
            }
            else callback(undefined);
        });

    },

    unstalk: function(keyMe, keyTarget, callback) {
        async.parallel([
            function(ayncCallback) {
                userService.getOne(keyMe, ayncCallback)
            },
            function(ayncCallback){
                userService.getOne(keyTarget, ayncCallback)
            }
        ], function(err, results){
            //Traitement

            var me = results[0];
            var target = results[1];

            if(me !== undefined && me !== null && target !== undefined && target !== null && me.id !== target.id){

                var stalking;
                if(me.idStalking === undefined){
                    stalking = [];
                }else stalking = JSON.parse(me.idStalking);

                if(stalking.indexOf(target.id) == -1){
                    callback(undefined);
                }else{
                    stalking.splice(stalking.indexOf(target.id), 1);

                    me.idStalking = JSON.stringify(stalking);

                    var stalkers;
                    if(target.idStalkers === undefined){
                        stalkers = [];
                    }else stalkers = JSON.parse(target.idStalkers);

                    stalkers.splice(stalkers.indexOf(me.id), 1);

                    target.idStalkers = JSON.stringify(stalkers);

                    userService.update(me.id, me, callback);
                    userService.update(target.id, target, callback);
                }


            }
            else callback(undefined);

        });

    },

    getStalking: function(keyMe, callback){
        userService.getOne(keyMe, function(err, me){
            if(me !== undefined)
                callback( me.idStalking !== undefined ? JSON.parse(me.idStalking) : [] );
            else callback(undefined);
        });

    },

    getStalkers: function(keyMe, callback){
        userService.getOne(keyMe, function(err, me){
            if(me !== undefined)
                callback(me.idStalkers !== undefined ? JSON.parse(me.idStalkers) : [] );
            else callback(undefined);
        });

    }
};

module.exports = userService;
