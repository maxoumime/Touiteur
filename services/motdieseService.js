var db = require('./db/db');
var setdb = require('./db/setdb');
var winston = require('winston');

var motdieseService = {

    /**
     * Récupère tous les mots-dièse
     * @param callback
     * @returns {*}
     */
    getAll: function(callback){

        if(callback === undefined) callback = nocallback;

        setdb.getAll(db.MOTDIESE, callback);
    },

    /**
     * Récupère un mot-dièse random
     */
    getRandom: function(callback){

        if(callback === undefined) callback = nocallback;

        //Récupère tous les mots-dièse
        motdieseService.getAll(function(err, motsdiese){

            //S'il y en a
            if(motsdiese !== null && motsdiese.length > 0) {

                //On en récupère un aléatoire, puis on le renvoie
                var index = Math.floor((Math.random() * motsdiese.length));
                callback(motsdiese[index]);
            }else callback(null);

        });
    },

    /**
     * Récupère les touites par un mot-dièse
     */
    getTouitesId: function(motDiese, callback){

        if(callback === undefined) callback = nocallback;

        setdb.getOne(db.MOTDIESE, motDiese.toLowerCase(), callback);
    },

    /**
     * Ajoute un motdièse avec un ID de touite
     */
    add: function(motDiese, touiteId, callback){

        if(callback === undefined) callback = nocallback;

        motDiese = motDiese.toLowerCase();

        winston.info("Ajout du motdiese " + motDiese);
        setdb.add(db.MOTDIESE, touiteId, callback, motDiese);
    },

    /**
     * Ajoute plusieurs ID de touties à un mot-dièse
     */
    addAll: function(data, touiteId){

        var motsdiese;

        if(typeof data === 'string')
            motsdiese = motdieseService.extractMotsdiese(data);
        else motsdiese = data;

        winston.info("Ajout des motsdiese " + motsdiese);

        for(var motdieseIndex in motsdiese)
            motdieseService.add(motsdiese[motdieseIndex], touiteId);
    },

    /**
     * Supprime un ID de toutie d'un mot-dièse
     */
    deleteTouiteFrom: function(idTouite, motdiese, callback){

        if(callback === undefined) callback = nocallback;

        motdieseService.getTouitesId(motdiese, function(err, idTouites){

            if(idTouites !== null){

                idTouites.splice(idTouites.indexOf(idTouite), 1);

                winston.info("Suppression du touite " + idTouite + " de " + motdiese);
                setdb.update(db.MOTDIESE, motdiese, idTouites, callback);

            }else callback(undefined);
        });
    },

    /**
     * Récupère les mots-dièse d'un touite
     */
    extractMotsdiese: function(text){

        var pattern = /#\w*/g;

        var motsDieseRetour = [];
        var motsDieseExtracted = text.toLowerCase().match(pattern);

        if(motsDieseExtracted !== null)
            for(var motdieseIndex in motsDieseExtracted){
                var motdiese = motsDieseExtracted[motdieseIndex].replace("#", "");
                motsDieseRetour.push(motdiese);
            }

        return motsDieseRetour;
    }
};

function nocallback(){}

module.exports = motdieseService;