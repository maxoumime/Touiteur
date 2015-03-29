var express = require('express');
var userService = require('../services/userService');
var router = express.Router();

/* GET users listing. */
router.get('/', function(request, response, next) {

    userService.getAll(function(err, data){
        response.send(data);
    });

});

router.get('/:idUser', function(request, response, next){

    userService.getOne(request.params.idUser, function(err, data){
        response.send(data);
    });
});

router.post('/', function(request, response){

    var user = request.body;

    if(isUserValid(user)){

        userService.add(user, function(result){
            if(result !== undefined)
                response.send(result);
            else {
                response.statusCode = 500;
                response.end();
            }
        });

    }else {
        response.statusCode = 400;
        response.end();
    }

});

router.delete('/:idUser', function(request, response){
    var idUser = request.params.idUser;

    userService.delete(idUser, function(result){

        if(!result)
            response.statusCode = 404;

        response.end();
    });
});

function isUserValid(user){

    var valid = true;

    valid &= user !== undefined;
    valid &= user.id !== undefined;
    valid &= user.name !== undefined;
    valid &= user.password !== undefined;

    return valid;
}

module.exports = router;
