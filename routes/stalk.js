var express = require('express');
var userService = require('../services/userService');
var router = express.Router();

/* Stalk someone. */
router.post('/:idUser', function(request, response, next) {
    var idUser = request.params.idUser;
    response.send(userService.follow("maxoumime", idUser));
});

/* Un-stalk someone */
router.delete('/:idUser', function(request, response, next) {
    var idUser = request.params.idUser;
    response.send(userService.unfollow("maxoumime", idUser));});

module.exports = router;
