var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  response.render('index', { title: 'Touiteur' });
});

router.post('/', function(request, response, next) {
    response.render('index', { title: 'Touiteur' });
});

module.exports = router;
