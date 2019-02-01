var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get pagination Query
var getPaginationString = function(p){
	startingPoint = ((p.page-1) * p.dataPerPage);
	s = "LIMIT "+ startingPoint + ", "+ p.dataPerPage;
	return s;
};

//Count how many entries Classroom have for pagination
var getNumEntries = function(stringWhere, callback){
	mysql.execute("select count(*) as numEntries from T_CLASSROOM " + stringWhere + ";", function(result){
            callback(result[0].numEntries);
    });
};

//Get all (maybe useless)
router.post('/getAll', function(req, res){
	pagination = req.body;
	stringPag = getPaginationString(pagination);
	stringWhere = "where 1=1 "
    mysql.execute("select * from T_CLASSROOM "+ stringWhere + stringPag + ";", function(result){
		entries = getNumEntries(stringWhere, function(numEntries){
			res.json({success:true, data:result, numEntries:numEntries});
		});
    });

});

//Get by id
router.get('/get/:id', function(req, res){
	var id = req.params.id;
	mysql.execute("select * from T_CLASSROOM where ID = " + id + ";", function(result){
		if(result.length == 0){
			res.json({success:false, data:"Something is wrong. it seems like this classroom do not exist in the DB. Please talk to the Admin."});
		}
		res.json({success: true, data:result});
	});
});

//Get by Filter
router.post('/getFilter', function(req, res){
	var filter = req.body;
	filter.pagination = {page:filter.page, dataPerPage:filter.dataPerPage}
	string = "select * from T_CLASSROOM ";
	stringWhere = " where 1=1 ";
	stringPag = getPaginationString(filter.pagination);
	if(filter.room != null && filter.room != ""){
		stringWhere += "and TXT_ROOM LIKE '%"+ filter.room +"%'";
	}
	if(filter.restrict != null && filter.restrict != ""){
        stringWhere += "and FL_RESTRICT LIKE '%"+ filter.restrict +"%'";
    }
	mysql.execute(string+stringWhere+stringPag+";", function(result){
		entries = getNumEntries(stringWhere, function(numEntries){
            res.json({success:true, data:result, numEntries:numEntries});
        });
    });
});

//Delete (Logical) by id
router.post("/delete/:id", function(req, res){
	var id = req.params.id;
	mysql.execute("delete from T_CLASSROOM where ID = " + id + ";", function(result){
		res.json(result);
	});
});

//Check if already exists
router.post('/checkIfExists', function(req, res){
	classroom = req.body;
	mysql.execute("select * from T_CLASSROOM where TXT_ROOM = '" + classroom.room + "'", function(result){
		res.json(result);
	});
});

//Save to Database
router.post('/save', function(req, res){
	data = req.body;

	//Error Handling
	if (data.room == null || data.room == ""){
		res.json({success: false, data:"Room is missing."});
		return;
	}


	if(data.id == undefined || data.id == "" || data.id == null){
		console.log("insert into T_CLASSROOM values(0, '" + data.room + "', "+ data.restrict +");");
		mysql.execute("insert into T_CLASSROOM values(0, '" + data.room + "', "+ data.restrict +");", function(result){
			res.json({success: true, data:result});
		});
	}
	else {
		mysql.execute("update T_CLASSROOM set TXT_ROOM='" + data.room + "', FL_RESTRICT='"+ data.restrict + "' where ID = "+ data.id + ";", function(result){
			res.json({success: true, data:result});
		});
	}
});

module.exports = router;
