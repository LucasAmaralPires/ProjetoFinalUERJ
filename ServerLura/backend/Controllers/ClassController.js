var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get pagination Query
var getPaginationString = function(p){
	startingPoint = ((p.page-1) * p.dataPerPage);
	s = "LIMIT "+ startingPoint + ", "+ p.dataPerPage;
	return s;
};

//Count how many entries Class have for pagination
var getNumEntries = function(stringWhere, callback){
	mysql.execute("select count(*) as numEntries from T_CLASS " + stringWhere + ";", function(result){
            callback(result[0].numEntries);
    });
};

//Get all (maybe useless)
router.post('/getAll', function(req, res){
	pagination = req.body;
	stringPag = getPaginationString(pagination);
    mysql.execute("select * from T_CLASS "+ stringPag + ";", function(result){
		entries = getNumEntries("", function(numEntries){
			res.json({success:true, data:result, numEntries:numEntries});
		});
    });

});

//Get by id
router.get('/get/:id', function(req, res){
	var id = req.params.id;
	mysql.execute("select * from T_CLASS where ID = " + id + ";", function(result){
		if(result.length == 0){
			res.json({success:false, data:"Something is wrong. it seems like this class do not exist in the DB. Please talk to the Admin."});
		}
		res.json({success: true, data:result});
	});
});

//Get by Filter.
router.post('/getFilter', function(req, res){
	var filter = req.body;
	filter.pagination = {page:filter.page, dataPerPage:filter.dataPerPage}
	string = "select * from T_CLASS ";
	stringWhere = " where 1=1 ";
	stringPag = getPaginationString(filter.pagination);
	if(filter.idSubject != null && filter.idSubject != ""){
		stringWhere += "and ID_SUBJECT LIKE '"+ filter.idSubject +"'";
	}
	if(filter.numClass != null && filter.numClass != ""){
        stringWhere += "and NUM_CLASS LIKE '%"+ filter.numClass +"%'";
    }
	if(filter.semester != null && filter.semester != ""){
        stringWhere += "and TXT_SEMESTER LIKE '%"+ filter.semester +"%'";
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
	mysql.execute("delete from T_CLASS where ID = " + id + ";", function(result){
		res.json(result);
	});
});

//Check if already exists
router.post('/checkIfExists', function(req, res){
	data = req.body;
	mysql.execute("select * from T_CLASS where ID_SUBJECT = '" + data.idSubject + "' and NUM_CLASS='" + data.numClass + "' and TXT_SEMESTER='" + data.semester + "'", function(result){
		res.json(result);
	});
});

//Save to Database
router.post('/save', function(req, res){
	data = req.body;

	//Error Handling
	if (data.subjectId == null || data.subjectId == ""){
		res.json({success: false, data:"Subject is missing."});
		return;
	}
	if (data.numClass == null || data.numClass == ""){
        res.json({success: false, data:"Class Number is missing."});
        return;
    }

	if(data.id == undefined || data.id == "" || data.id == null){
		mysql.execute("insert into T_CLASS values(0, " + data.subjectId + ", '"+ data.numClass + "',NOW(), '" + data.semester + "');", function(result){
			res.json({success: true, data:result});
		});
	}
	else {
		mysql.execute("update T_CLASS set ID_SUBJECT=" + data.subjectId + ", NUM_CLASS="+ data.numClass + ", TXT_SEMESTER='" + data.semester + "' where ID = "+ data.id + ";", function(result){
			res.json({success: true, data:result});
		});
	}
});

module.exports = router;
