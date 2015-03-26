var express = require('express');
var db = require('../services/db');
var router = express.Router();

/* GET touites. */
router.get('/', function(request, response, next) {
    var touites = db.getAll(db.TOUITE);
    response.send(touites);
});

router.post('/', function(request, response){
   response.send(request.body);
});

module.exports = router;
