var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get pagination Query
var getPaginationString = function(p){
	startingPoint = ((p.page-1) * p.dataPerPage);
	s = "LIMIT "+ startingPoint + ", "+ p.dataPerPage;
	return s;
};

//Count how many entries Student have for pagination
var getNumEntries = function(stringWhere, callback){
	mysql.execute("select count(*) as numEntries from T_STUDENT " + stringWhere + ";", function(result){
            callback(result[0].numEntries);
    });
};

//Get all
router.get('/getAll', function(req, res){
	stringWhere = "where DAT_REMOVED IS NULL order by TXT_NAME"
    mysql.execute("select * from T_STUDENT "+ stringWhere + ";", function(result){
		res.json({success:true, data:result});
    });
});

//Get by id
router.get('/get/:id', function(req, res){
	var id = req.params.id;
	mysql.execute("select * from T_STUDENT where ID = " + id + ";", function(result){
		if(result.length == 0){
			res.json({success:false, data:"Something is wrong. it seems like this student do not exist in the DB. Please talk to the Admin."});
		}
		res.json({success: true, data:result});
	});
});

//Get by Filter
router.post('/getFilter', function(req, res){
	var filter = req.body;
	filter.pagination = {page:filter.page, dataPerPage:filter.dataPerPage}
	string = "select * from T_STUDENT ";
	stringWhere = " where DAT_REMOVED IS NULL ";
	stringPag = getPaginationString(filter.pagination);
	if(filter.name != null && filter.name != ""){
		stringWhere += "and TXT_NAME LIKE '%"+ filter.name +"%'";
	}
	if(filter.matriculation != null && filter.matriculation != ""){
        stringWhere += "and NUM_MATRICULATION LIKE '%"+ filter.matriculation +"%'";
    }
	if(filter.card != null && filter.card != ""){
        stringWhere += "and NUM_CARD LIKE '%"+ filter.card +"%'";
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
	mysql.execute("update T_STUDENT set DAT_REMOVED = NOW() where ID = " + id + ";", function(result){
		deleteFromClasses(id);
		res.json(result);
	});
});

//Delete from every Class when deleted
var deleteFromClasses = function(id){
	mysql.execute("delete from T_STUDENT_CLASS where ID_STUDENT=" + id + ";", function(result){
		return;
	});
};

//Check if already exists
router.post('/checkIfExists', function(req, res){
	student = req.body;
	mysql.execute("select * from T_STUDENT where NUM_MATRICULATION = '" + student.matriculation + "'", function(result){
		res.json(result);
	});
});

//Save to Database
router.post('/save', function(req, res){
	data = req.body;

	//Error Handling
	if (data.name == null || data.name == ""){
		res.json({success: false, data:"Name is missing."});
		return;
	}
	if (data.matriculation == null || data.matriculation == ""){
        res.json({success: false, data:"Matriculation is missing."});
        return;
    }


	if(data.id == undefined || data.id == "" || data.id == null){
		mysql.execute("insert into T_STUDENT values(0, '" + data.matriculation + "', '"+ data.card + "', '" + data.name + "', NULL);", function(result){
			res.json({success: true, data:result});
		});
	}
	else {
		mysql.execute("update T_STUDENT set NUM_MATRICULATION='" + data.matriculation + "', NUM_CARD='"+ data.card + "', TXT_NAME='" + data.name + "' where ID = "+ data.id + ";", function(result){
			res.json({success: true, data:result});
		});
	}
});

module.exports = router;
