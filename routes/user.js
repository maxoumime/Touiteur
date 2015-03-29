var express = require('express');
var userService = require('../services/userService');
var router = express.Router();

/* GET users listing. */
router.get('/', function(request, response, next) {
    response.send(userService.getAll());
});

router.get('/:idUser', function(request, response, next){
    response.send(userService.getOne(request.params.idUser));
});

router.post('/', function(request, response){

    var user = {
        username: 'maxoumime',
        name: 'Maxime',
        password: "password"
    };

    var key = userService.add(user);

    response.send(key);
    //response.send(request.body);
});

module.exports = router;
