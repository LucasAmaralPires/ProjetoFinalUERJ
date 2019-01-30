var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get pagination Query
var getPaginationString = function(p){
	startingPoint = ((p.page-1) * p.dataPerPage);
	s = "LIMIT "+ startingPoint + ", "+ p.dataPerPage;
	return s;
};

//Count how many entries Subjects have for pagination
var getNumEntries = function(stringWhere, callback){
	mysql.execute("select count(*) as numEntries from T_SUBJECT " + stringWhere + ";", function(result){
            callback(result[0].numEntries);
    });
};

//Get all (maybe useless)
router.post('/getAll', function(req, res){
	pagination = req.body;
	stringPag = getPaginationString(pagination);
    mysql.execute("select * from T_SUBJECT "+ stringPag + ";", function(result){
		entries = getNumEntries("", function(numEntries){
			res.json({success:true, data:result, numEntries:numEntries});
		});
    });

});

//Get by id
router.get('/get/:id', function(req, res){
	var id = req.params.id;
	mysql.execute("select * from T_SUBJECT where ID = " + id + ";", function(result){
		if(result.length == 0){
			res.json({success:false, data:"Something is wrong. it seems like this subject do not exist in the DB. Please talk to the Admin."});
		}
		res.json({success: true, data:result});
	});
});

//Get by Filter
router.post('/getFilter', function(req, res){
	var filter = req.body;
	filter.pagination = {page:filter.page, dataPerPage:filter.dataPerPage}
	string = "select * from T_SUBJECT ";
	stringWhere = " where 1=1 ";
	stringPag = getPaginationString(filter.pagination);
	if(filter.code != null && filter.code != ""){
		stringWhere += "and NUM_CODE LIKE '%"+ filter.code +"%'";
	}
	if(filter.credits != null && filter.credits != ""){
        stringWhere += "and NUM_CREDITS LIKE '%"+ filter.credits +"%'";
    }
	if(filter.name != null && filter.name != ""){
        stringWhere += "and TXT_NAME LIKE '%"+ filter.name +"%'";
    }
	mysql.execute(string+stringWhere+stringPag+";", function(result){
		entries = getNumEntries(stringWhere, function(numEntries){
            res.json({success:true, data:result, numEntries:numEntries});
        });
    });
});

//Delete by id
router.post("/delete/:id", function(req, res){
	var id = req.params.id;
	mysql.execute("delete from T_SUBJECT where ID = " + id + ";", function(result){
		res.json(result);
	});
});

//Check if already exists
router.post('/checkIfExists', function(req, res){
	subject = req.body;
	mysql.execute("select * from T_SUBJECT where NUM_CODE = '" + subject.code + "' OR TXT_NAME = '"+ subject.name +"';", function(result){
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
	if (data.code == null || data.code == ""){
        res.json({success: false, data:"Code is missing."});
        return;
    }
	if (data.credits == null || data.credits == ""){
        res.json({success: false, data:"Credits is missing."});
        return;
    }


	if(data.id == undefined || data.id == "" || data.id == null){
		mysql.execute("insert into T_SUBJECT values(0, '" + data.code + "', '"+ data.credits + "', '" + data.name + "');", function(result){
			res.json({success: true, data:result});
		});
	}
	else {
		mysql.execute("update T_SUBJECT set NUM_CODE='" + data.code + "', NUM_CREDITS='"+ data.credits + "', TXT_NAME='" + data.name + "' where ID = "+ data.id + ";", function(result){
			res.json({success: true, data:result});
		});
	}
});

module.exports = router;
