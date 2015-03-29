var db = require('./db');
var userService = require('./userService');

var touiteService = {

    //Fonctions
    getAll: function(callback){
        return db.getAll(db.TOUITE, callback);
    },

    getOne: function(key, callback){
        return db.getOne(db.TOUITE, key, callback);
    },

    find: function(keyword) {
        return [];
    },

    add: function(data, callback){

        data.time = Date.now();

        db.add(db.TOUITE, data, function(touiteData){
            console.log(touiteData)
            if(touiteData !== undefined){
                userService.getOne(touiteData.id, function(err, me){
                    if(me !== undefined && me !== null){
                        var touites;
                        if(me.idTouites === undefined){
                            touites = [];
                        }else touites = JSON.parse(me.idTouites);

                        touites.push(touiteData.id);

                        me.idTouites = JSON.stringify(touites);

                        userService.update(me.id, me);
                    }

                });
            }
            callback(touiteData);
        });
    },

    delete: function(key, callback){

        db.getOne(db.TOUITE, key, function(err, touite){

            if(touite !== undefined && touite !== null){

                var idAuthor = touite.idAuthor;

                db.delete(db.TOUITE, key, function(result){
                    if(result){
                        userService.getOne(idAuthor, function(err, me){
                            if(me !== undefined && me !== null){
                                var touites;
                                if(me.idTouites === undefined){
                                    touites = [];
                                }else touites = JSON.parse(me.idTouites);

                                touites.splice(touites.indexOf(touite.id), 1);

                                me.idTouites = JSON.stringify(touites);

                                userService.update(me.id, me);
                            }
                        });
                    }

                    callback(result);
                });
            }else callback(false);

        });
    }
};

module.exports = touiteService;
