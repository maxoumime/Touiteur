var express = require('express');
var router = express.Router();

/* GET stalking listing for an id. */
router.get('/:idUser', function(request, response, next) {
    var idUser = request.params.idUser;

    response.send(userService.getStalking(idUser));
});

module.exports = router;
