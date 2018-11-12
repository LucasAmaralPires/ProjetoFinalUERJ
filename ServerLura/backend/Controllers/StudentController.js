var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get all
router.get('/getAll', function(req, res){
	all = {};
    mysql.execute("select * from T_STUDENT where DAT_REMOVED IS NULL;", function(result){
            res.json(result);
    });

});

//Get by id
router.get('/get/:id', function(req, res){
	var id = req.params.id;
	mysql.execute("select * from T_STUDENT where ID = " + id + ";", function(result){
		res.json(result);
	});
});

//Delete (Logical) by id
router.post("/delete/:id", function(req, res){
	var id = req.params.id;
	mysql.execute("update T_STUDENT set DAT_REMOVED = NOW() where ID = " + id + ";", function(result){
		res.json(result);
	});
});

//Save to Database
router.post('/save', function(req, res){
	data = req.body;
	if(data.id == undefined || data.id == "" || data.id == null){
		mysql.execute("insert into T_STUDENT values(0, '" + data.matriculation + "', '"+ data.card + "', '" + data.name + "', NULL);", function(result){
			res.json(result);
		});
	}
	else {
		mysql.execute("update T_STUDENT set NUM_MATRICULATION='" + data.matriculation + "', NUM_CARD='"+ data.card + "', TXT_NAME='" + data.name + "' where ID = "+ data.id + ";", function(result){
			res.json(result);
		});
	}
});

module.exports = router;
