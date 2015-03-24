var express = require('express');
var router = express.Router();

/* GET stalkers listing by id. */
router.get('/:idUser', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
