var express = require('express');
var touiteService = require('../services/touiteService');
var router = express.Router();

/* GET touites. */
router.get('/', function(request, response, next) {
    touiteService.getAll(function(err,data){
        response.send(data);
    });
});

router.get('/:idTouite', function(request, response, next) {

    touiteService.getOne(request.params.idTouite, function(err, data){

        if(data != undefined)
            response.send(data);
        else {
            response.statusCode = 404;
            response.end();
        }
    });

});

router.post('/', function(request, response){

    var touite = request.body;

    if(isTouiteValid(touite)){
        touiteService.add(touite, function(touiteAdded){

            if(touiteAdded !== undefined)
                response.send(touiteAdded);
            else {
                response.statusCode = 500;
                response.end();
            }
        });
    }else {
        response.statusCode = 400;
        response.end();
    }

});

router.delete('/:idTouite', function(request, response){

    var idTouite = request.params.idTouite;

    touiteService.delete(idTouite, function(result){
        if(!result)
            response.statusCode = 404;

        response.end();
    })
});

function isTouiteValid(touite){

    var valid = true;

    valid &= touite !== undefined;

    //TODO authorId temp avant récupération cookie
    valid &= touite.authorId !== undefined;
    valid &= touite.content !== undefined;

    return valid;
}

module.exports = router;
