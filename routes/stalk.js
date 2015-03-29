var express = require('express');
var userService = require('../services/userService');
var router = express.Router();

var db = require('../services/db');

//TODO DON'T STALK ME
//TODO ETRANGE STALKERS & STALING INVERSES

/* Stalk someone. */
router.post('/:idUser', function(request, response, next) {
    var idUser = request.params.idUser;
    response.send(userService.stalk("maxoumime", idUser));
});

/* Un-stalk someone */
router.delete('/:idUser', function(request, response, next) {
    var idUser = request.params.idUser;
    response.send(userService.unstalk("maxoumime", idUser));
});

router.get('/', function(request, response){
    response.send(db.getNextTouiteIncr());
});

module.exports = router;
