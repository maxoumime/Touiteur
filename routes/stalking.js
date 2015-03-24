var express = require('express');
var router = express.Router();

/* GET stalking listing for an id. */
router.get('/:idUser', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
