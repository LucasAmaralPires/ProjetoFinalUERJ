var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get all
router.get('/getAll', function(req, res){
    mysql.execute("select * from T_LECTURE;", function(result){
		res.json({success:true, data:result});
    });
});

//Get by lecture id
router.get('/getByLecture/:id', function(req, res){
	var id = req.params.id;
	string = "select * from T_ATTENDANCE where ID_LECTURE = " + id + ";"
	mysql.execute(string, function(result){
		if(result.length == 0){
			res.json({success:false, data:"Something is wrong. it seems like this lecture do not exist in the DB. Please talk to the Admin."});
		} else{
			res.json({success: true, data:result});
		}
	});
});

//Get by student/class id
router.get('/getByClassStudent/:idClass/:idStudent', function(req, res){
    var idClass = req.params.idClass;
	var idStudent = req.params.idStudent;
    string = "select a.ID, sc.ID_CLASS, a.ID_STUDENT, l.DAT_DAY_OF_LECTURE from T_ATTENDANCE a left join T_LECTURE l on a.ID_LECTURE = l.ID left join T_SCHEDULE_CLASS sc on sc.ID=l.ID_SCHEDULE_CLASS where sc.ID_CLASS = " + idClass + " and a.ID_STUDENT = "+ idStudent + ";"
    mysql.execute(string, function(result){
        if(result.length == 0){
            res.json({success:false, data:"Something is wrong."});
        } else{
			res.json({success: true, data:result});
		}
    });
});

module.exports = router;
