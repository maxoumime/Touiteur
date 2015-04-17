var db = require('./db/db');
var setdb = require('./db/setdb');

var motdieseService = {

    getAll: function(callback){

        if(callback === undefined) callback = nocallback;

        setdb.getAll(db.MOTDIESE, callback);
    },

    getRandom: function(callback){

        if(callback === undefined) callback = nocallback;

        motdieseService.getAll(function(err, motsdiese){

            if(motsdiese !== null && motsdiese.length > 0) {

                var index = Math.floor((Math.random() * motsdiese.length));
                callback(motsdiese[index]);
            }else callback(null);

        });
    },

    getTouitesId: function(motDiese, callback){

        if(callback === undefined) callback = nocallback;

        setdb.getOne(db.MOTDIESE, motDiese.toLowerCase(), callback);
    },

    add: function(motDiese, touiteId, callback){

        if(callback === undefined) callback = nocallback;

        setdb.add(db.MOTDIESE, touiteId, callback, motDiese.toLowerCase());
    },

    addAll: function(data, touiteId){

        var motsdiese;

        if(typeof data === 'string')
            motsdiese = motdieseService.extractMotsdiese(data);
        else motsdiese = data;

        for(var motdieseIndex in motsdiese)
            motdieseService.add(motsdiese[motdieseIndex], touiteId);
    },

    deleteTouiteFrom: function(idTouite, motdiese, callback){

        if(callback === undefined) callback = nocallback;

        motdieseService.getTouitesId(motdiese, function(err, idTouites){

            if(idTouites !== null){

                idTouites.splice(idTouites.indexOf(idTouite), 1);

                setdb.update(db.MOTDIESE, motdiese, idTouites, callback);

            }else callback(undefined);
        });
    },

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