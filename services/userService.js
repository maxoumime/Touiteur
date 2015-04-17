var db = require('./db/db');
var hashdb = require('./db/hashdb');
var async = require('async');

var userService = {

    //Fonctions
    getAll: function(callback) {

        if(callback === undefined) callback = nocallback;

        return hashdb.getAll(db.USER, callback);
    },

    getOne: function (key, callback) {

        if(callback === undefined) callback = nocallback;

        return hashdb.getOne(db.USER, key, callback);
    },

    add: function (data, callback) {

        if(callback === undefined) callback = nocallback;

        data.registrationDate = Date.now();

        return hashdb.add(db.USER, data, callback, data.id);
    },

    update: function(key, data, callback){

        if(callback === undefined) callback = nocallback;

        return hashdb.update(db.USER, key, data, callback);
    },

    delete: function (key, callback) {

        if(callback === undefined) callback = nocallback;

        hashdb.delete(db.USER, key, callback);
    },

    stalk: function (keyMe, keyTarget, callback) {

        if(callback === undefined) callback = nocallback;

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
                    callback("ALREADY");
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

        if(callback === undefined) callback = nocallback;

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
                    callback("NOT");
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

        if(callback === undefined) callback = nocallback;

        userService.getOne(keyMe, function(err, me){
            if(me !== undefined)
                callback( me.idStalking !== undefined ? JSON.parse(me.idStalking) : [] );
            else callback(undefined);
        });

    },

    getStalkers: function(keyMe, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(keyMe, function(err, me){
            if(me !== undefined)
                callback(me.idStalkers !== undefined ? JSON.parse(me.idStalkers) : [] );
            else callback(undefined);
        });

    },

    getTouites: function(keyMe, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(keyMe, function(err, me){
            if(me !== undefined && me !== null)
                callback(me.idTouites !== undefined ? JSON.parse(me.idTouites) : [] );
            else callback(undefined);
        });
    },

    doesExist: function(username, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(username, function(err, data){

            callback( data !== undefined && data !== null );
        });
    },

    getRandom: function(me, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(me, function(errMe, dataMe){

            if(dataMe !== null){

                userService.getAll(function(errAll, dataAll){

                    if(dataAll !== null){

                        var stalking;
                        if(dataMe.idStalking === undefined){
                            stalking = [];
                        }else stalking = JSON.parse(dataMe.idStalking);

                        // +1 car on ne veut pas se trouver dans les random
                        stalking.push(me);

                        if(dataAll.length > stalking.length){

                            var index;
                            do{
                                index = Math.floor((Math.random() * dataAll.length));
                            }while( stalking.indexOf(dataAll[index]) !== -1 );

                            callback(dataAll[index]);

                        }else callback(null);

                    }else callback(null);
                });

            }else callback(null);

        });
    }
};

function nocallback(){}

module.exports = userService;
