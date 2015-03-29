var db = require('./db');

var userService = {

    //Fonctions
    getAll: function () {
        return db.getAll(db.USER);
    },

    getOne: function (key) {
        return db.getOne(db.USER, key);
    },

    add: function (data) {
        return db.add(db.USER, data, data.username);
    },

    delete: function (key) {
        db.delete(db.USER, key);
    },

    follow: function (keyMe, keyTarget) {
        var me = userService.getOne(keyMe);
        var target = userService.getOne(keyTarget);

        //Traitement
    },

    unfollow: function(keyMe, keyTarget) {
        var me = userService.getOne(keyMe);
        var target = userService.getOne(keyTarget);

        //Traitement
    },

    getStalking: function(keyMe){
        var me = userService.getOne(keyMe);

        return me.idStalkers;
    },

    getStalkers: function(keyMe){
        var me = userService.getOne(keyMe);

        return me.idStalking;

    }
};

module.exports = userService;
