var express = require('express');
var router = express.Router();

/* GET touites. */
router.get('/', function(request, response, next) {
    response.send('respond with a resource');
});

module.exports = router;
