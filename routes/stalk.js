var express = require('express');
var router = express.Router();

/* Stalk someone. */
router.post('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* Un-stalk someone */
router.delete('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
