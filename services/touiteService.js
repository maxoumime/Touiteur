var db = require('./db/db');
var hashdb = require('./db/hashdb');
var userService = require('./userService');
var motdieseService = require('./motdieseService');

var touiteService = {

    //Fonctions
    getAll: function(callback){

        if(callback === undefined) callback = nocallback;

        return hashdb.getAll(db.TOUITE, callback);
    },

    getOne: function(key, callback){

        if(callback === undefined) callback = nocallback;

        return hashdb.getOne(db.TOUITE, key, callback);
    },

    add: function(data, callback){

        if(callback === undefined) callback = nocallback;

        data.time = Date.now();

        var motsdiese = motdieseService.extractMotsdiese(data.content);
        data.motsdiese = JSON.stringify(motsdiese);

        hashdb.add(db.TOUITE, data, function(touiteData){
            if(touiteData !== undefined){
                userService.getOne(touiteData.authorId, function(err, me){
                    if(me !== undefined && me !== null){
                        var touites;
                        if(me.idTouites === undefined){
                            touites = [];
                        }else touites = JSON.parse(me.idTouites);

                        touites.unshift(touiteData.id);

                        me.idTouites = JSON.stringify(touites);

                        userService.update(me.id, me);

                        motdieseService.addAll(motsdiese, touiteData.id);
                    }

                });
            }
            callback(touiteData);
        });
    },

    delete: function(key, callback){

        if(callback === undefined) callback = nocallback;

        hashdb.getOne(db.TOUITE, key, function(err, touite){

            if(touite !== undefined && touite !== null){

                var idAuthor = touite.authorId;

                hashdb.delete(db.TOUITE, key, function(result){
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


                            if(touite.motsdiese !== undefined){

                                var motsdiese = JSON.parse(touite.motsdiese);

                                for(var motdieseIndex in motsdiese){

                                    var motdiese = motsdiese[motdieseIndex];
                                    motdieseService.deleteTouiteFrom(key, motdiese);
                                }
                            }
                        });
                    }

                    callback(result);
                });
            }else callback(false);

        });
    }
};

function nocallback(){}

module.exports = touiteService;
