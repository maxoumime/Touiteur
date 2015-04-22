var db = require('./db/db');
var hashdb = require('./db/hashdb');
var async = require('async');
var winston = require('winston');

var userService = {

    //Fonctions

    /**
     * Récupération de tous les users
     * @param callback
     * @returns {*}
     */
    getAll: function(callback) {

        if(callback === undefined) callback = nocallback;

        return hashdb.getAll(db.USER, callback);
    },

    /**
     * Récupération d'un user par son username
     * @param key
     * @param callback
     * @returns {*}
     */
    getOne: function (key, callback) {

        if(callback === undefined) callback = nocallback;

        return hashdb.getOne(db.USER, key, callback);
    },

    /**
     * Ajout d'un user
     * @param data
     * @param callback
     * @returns {*}
     */
    add: function (data, callback) {

        if(callback === undefined) callback = nocallback;

        data.registrationDate = Date.now();

        winston.info("Ajout du user " + data.id);
        return hashdb.add(db.USER, data, callback, data.id);
    },

    /**
     * Mise à jour d'un user
     * @param key
     * @param data
     * @param callback
     * @returns {*}
     */
    update: function(key, data, callback){

        if(callback === undefined) callback = nocallback;

        winston.info("Mise à jour du user " + key);
        return hashdb.update(db.USER, key, data, callback);
    },

    /**
     * Suppression d'un user
     * @param key
     * @param callback
     */
    delete: function (key, callback) {

        if(callback === undefined) callback = nocallback;

        winston.info("Suppression du user " + key);
        hashdb.delete(db.USER, key, callback);
    },

    /**
     * Stalk d'un user
     * @param keyMe
     * @param keyTarget
     * @param callback
     */
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

                //Si l'utilisateur ne stalke personne, on prépare un tableau vide, sinon on récupère sa liste
                var stalking;
                if(me.idStalking === undefined){
                    stalking = [];
                }else stalking = JSON.parse(me.idStalking);

                //Si l'utilisateur est déjà stalké
                if(stalking.indexOf(target.id) != -1) {
                    callback("ALREADY");
                }else{

                    //Sinon on ajoute cet utilisateur à la liste
                    stalking.push(target.id);

                    //Stringify du tableau pour stockage
                    me.idStalking = JSON.stringify(stalking);

                    //Si l'utilisateur cible n'a pas de stalkers, on prépare un tableau vide, sinon on récupère sa liste
                    var stalkers;
                    if (target.idStalkers === undefined) {
                        stalkers = [];
                    } else stalkers = JSON.parse(target.idStalkers);

                    //Ajout de cet utilisateur
                    stalkers.push(me.id);

                    //Stringify du tableau pour stockage
                    target.idStalkers = JSON.stringify(stalkers);

                    winston.info("Stalk de " + me.id + " vers " + target.id);

                    //Mise à jour des deux utilisateurs
                    userService.update(me.id, me, callback);
                    userService.update(target.id, target, callback);
                }
            }
            else callback(undefined);
        });

    },

    /**
     * Un-stalk d'un utilisateur
     * @param keyMe
     * @param keyTarget
     * @param callback
     */
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

                    winston.info("Unstalk de " + me.id + " vers " + target.id);

                    userService.update(me.id, me, callback);
                    userService.update(target.id, target, callback);
                }


            }
            else callback(undefined);

        });

    },

    /**
     * Récupération des utilisateurs en cours de stalk
     * @param keyMe
     * @param callback
     */
    getStalking: function(keyMe, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(keyMe, function(err, me){
            if(me !== null)
                callback( me.idStalking !== undefined ? JSON.parse(me.idStalking) : [] );
            else callback(undefined);
        });

    },

    /**
     * Récupération des stalkers
     * @param keyMe
     * @param callback
     */
    getStalkers: function(keyMe, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(keyMe, function(err, me){
            if(me !== null)
                callback(me.idStalkers !== undefined ? JSON.parse(me.idStalkers) : [] );
            else callback(undefined);
        });

    },

    /**
     * Récupération des touites d'un user
     * @param keyMe
     * @param callback
     */
    getTouites: function(keyMe, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(keyMe, function(err, me){
            if(me !== undefined && me !== null)
                callback(me.idTouites !== undefined ? JSON.parse(me.idTouites) : [] );
            else callback(undefined);
        });
    },

    /**
     * Vérifie si le nom d'utilisateur existe
     * @param username
     * @param callback
     */
    doesExist: function(username, callback){

        if(callback === undefined) callback = nocallback;

        userService.getOne(username, function(err, data){

            callback( data !== undefined && data !== null );
        });
    },

    /**
     * Récupère un username aléatoire
     * @param me
     * @param callback
     */
    getRandom: function(me, callback){

        if(callback === undefined) callback = nocallback;

        //Récupération de l'utilisateur connecté
        userService.getOne(me, function(errMe, dataMe){

            if(dataMe !== null){

                //Récupération de tous les utilisateurs
                userService.getAll(function(errAll, dataAll){

                    if(dataAll !== null){

                        //Récupération des utilisateurs stalkés
                        var stalking;
                        if(dataMe.idStalking === undefined){
                            stalking = [];
                        }else stalking = JSON.parse(dataMe.idStalking);

                        // +1 car on ne veut pas se trouver dans les random
                        stalking.push(me);

                        //S'il reste bien des utilisateurs inconnus
                        if(dataAll.length > stalking.length){

                            //On récupère un indice aléatoire correspondant à un utilisateur inconnu pour l'utilisateur connecté
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
