var express = require('express');
var router = express.Router();

/* Stalk someone. */
router.post('/:idUser', function(request, response, next) {
    console.log(request);
    response.send(request.body);
});

/* Un-stalk someone */
router.delete('/:idUser', function(request, response, next) {
    response.send('respond with a resource');
});

module.exports = router;
