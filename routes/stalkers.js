var express = require('express');
var router = express.Router();

/* GET stalkers listing by id. */
router.get('/:idUser', function(request, response, next) {
    response.send('respond with a resource');
});

module.exports = router;
