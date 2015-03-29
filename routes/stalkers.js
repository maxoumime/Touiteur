var express = require('express');
var userService = require('../services/userService')
var router = express.Router();

/* GET stalkers listing by id. */
router.get('/:idUser', function(request, response, next) {
    var idUser = request.params.idUser;

    response.send(userService.getStalkers(idUser));
});

module.exports = router;
