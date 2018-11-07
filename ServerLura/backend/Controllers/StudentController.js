var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get all
router.get('/getAll', function(req, res){
	a = {};
        mysql.execute("select * from Pessoa;", function(result){
                a = result
                res.json(a);
        });

});

//Get by id
router.get('/get/:id', function(req, res){
	a = req.params.id;
	mysql.execute("select * from Pessoa where id = " + a + ";", function(result){
		res.json(result);
	});
});

//Save to Database
router.post('/save', function(req, res){
	console.log(req.body)
	res.json({id: 10});
});

module.exports = router;
