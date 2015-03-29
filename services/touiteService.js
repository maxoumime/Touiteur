var db = require('./db');
var userService = require('./userService');

var touiteService = {

    //Fonctions
    getAll: function(){
        return db.getAll(db.TOUITE);
    },

    getOne: function(key){
        return db.getOne(db.TOUITE, key);
    },

    find: function(keyword) {
        return [];
    },

    add: function(data){
        var key = db.add(db.TOUITE, data);

        data.time = Date.now();

        var me = userService.getOne(data.username);
        me.idTouites.push(key);

        return key;
    },

    delete: function(key){

        var touite = to
        db.delete(db.TOUITE, key);

        var me = userService.getOne(data.username);
        me.idTouites.push(key);
    }
};

module.exports = touiteService;
