var express = require('express');
var touiteService = require('../services/touiteService');
var router = express.Router();

/* GET touites. */
router.get('/', function(request, response, next) {
    var touites = touiteService.getAll();
    response.send(touites);
});

router.get('/:idTouite', function(request, response, next) {
    var touites = touiteService.getOne(request.params.idTouite);

    if(touites != undefined)
        response.send(touites);
    else {
        response.statusCode = 404;
        response.end();
    }
});

router.post('/', function(request, response){

    var touite = {
        username: 'maxoumime',
        content: "My first Tweet !"
    };

    var key = touiteService.add(touite);

    response.send(key);
    //response.send(request.body);
});

module.exports = router;
