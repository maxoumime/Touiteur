var db = require('./db/db');
var hashdb = require('./db/hashdb');
var userService = require('./userService');
var motdieseService = require('./motdieseService');

var touiteService = {

    //Fonctions

    /**
     * Récupère tous les touites
     * @param callback
     * @returns {*}
     */
    getAll: function(callback){

        if(callback === undefined) callback = nocallback;

        return hashdb.getAll(db.TOUITE, callback);
    },

    /**
     * Récupère un touite par son ID
     * @param key
     * @param callback
     * @returns {*}
     */
    getOne: function(key, callback){

        if(callback === undefined) callback = nocallback;

        return hashdb.getOne(db.TOUITE, key, callback);
    },

    /**
     * Ajoute un touite
     * @param data
     * @param callback
     */
    add: function(data, callback){

        if(callback === undefined) callback = nocallback;

        //Récupération de la date courante
        data.time = Date.now();

        //Récupération des mots-dièse du touite
        var motsdiese = motdieseService.extractMotsdiese(data.content);
        data.motsdiese = JSON.stringify(motsdiese);

        //Ajout du touite
        hashdb.add(db.TOUITE, data, function(touiteData){
            //Si le touite a bien été ajouté
            if(touiteData !== undefined){
                //Ajout du touite au user
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

    /**
     * Suppression du touite
     * @param key
     * @param callback
     */
    delete: function(key, callback){

        if(callback === undefined) callback = nocallback;

        //Récupération du touite
        hashdb.getOne(db.TOUITE, key, function(err, touite){

            //Si le touite existe
            if(touite !== undefined && touite !== null){

                //Récupération du username de l'auteur
                var idAuthor = touite.authorId;

                //Suppression du touite
                hashdb.delete(db.TOUITE, key, function(result){
                    if(result){
                        //Récupération du user
                        userService.getOne(idAuthor, function(err, me){

                            if(me !== undefined && me !== null){
                                //Suppression de sa liste de touites
                                var touites;
                                if(me.idTouites === undefined){
                                    touites = [];
                                }else touites = JSON.parse(me.idTouites);

                                touites.splice(touites.indexOf(touite.id), 1);

                                me.idTouites = JSON.stringify(touites);

                                userService.update(me.id, me);
                            }


                            if(touite.motsdiese !== undefined){

                                //Si des mots dièses sont présents
                                var motsdiese = JSON.parse(touite.motsdiese);

                                for(var motdieseIndex in motsdiese){

                                    //On les supprime
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
