var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get pagination Query
var getPaginationString = function(p){
	startingPoint = ((p.page-1) * p.dataPerPage);
	s = "LIMIT "+ startingPoint + ", "+ p.dataPerPage;
	return s;
};

//Count how many entries Teacher have for pagination
var getNumEntries = function(stringWhere, callback){
	mysql.execute("select count(*) as numEntries from T_TEACHER " + stringWhere + ";", function(result){
            callback(result[0].numEntries);
    });
};

//Get all
router.get('/getAll', function(req, res){
	stringWhere = "where DAT_REMOVED IS NULL order by TXT_NAME"
    mysql.execute("select * from T_TEACHER "+ stringWhere + ";", function(result){
		res.json({success:true, data:result});
    });
});

//Get by id
router.get('/get/:id', function(req, res){
	var id = req.params.id;
	mysql.execute("select * from T_TEACHER where ID = " + id + ";", function(result){
		if(result.length == 0){
			res.json({success:false, data:"Something is wrong. it seems like this teacher do not exist in the DB. Please talk to the Admin."});
		}
		res.json({success: true, data:result});
	});
});

//Get Classes by id
router.get('/getClasses/:id', function(req, res){
    var id = req.params.id;
    mysql.execute("select c.ID, s.TXT_NAME, c.NUM_CLASS, c.TXT_SEMESTER from T_TEACHER_CLASS tc, T_CLASS c, T_SUBJECT s where tc.ID_CLASS = c.ID and c.ID_SUBJECT = s.ID and tc.ID_TEACHER = " + id + ";", function(result){
        if(result.length == 0)
            res.json({success:false, data:"This Teacher is not enrolled to any Class for now."});
        else
			res.json({success: true, data:result});
    });
});

//Get by Filter
router.post('/getFilter', function(req, res){
	var filter = req.body;
	filter.pagination = {page:filter.page, dataPerPage:filter.dataPerPage}
	string = "select * from T_TEACHER ";
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
	mysql.execute("update T_TEACHER set DAT_REMOVED = NOW() where ID = " + id + ";", function(result){
		deleteFromClasses(id);
		res.json(result);
	});
});

//Delete from every Class when deleted
var deleteFromClasses = function(id){
    mysql.execute("delete from T_TEACHER_CLASS where ID_TEACHER=" + id + ";", function(result){
        return;
    });
};

//Check if already exists
router.post('/checkIfExists', function(req, res){
	teacher = req.body;
	mysql.execute("select * from T_TEACHER where NUM_MATRICULATION = '" + teacher.matriculation + "'", function(result){
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
		mysql.execute("insert into T_TEACHER values(0, '" + data.matriculation + "', '"+ data.card + "', '" + data.name + "', NULL);", function(result){
			res.json({success: true, data:result});
		});
	}
	else {
		mysql.execute("update T_TEACHER set NUM_MATRICULATION='" + data.matriculation + "', NUM_CARD='"+ data.card + "', TXT_NAME='" + data.name + "' where ID = "+ data.id + ";", function(result){
			res.json({success: true, data:result});
		});
	}
});

module.exports = router;
