var mysql = require('../MySQL/mysqlConnector.js');

var express = require('express'),
    router = express.Router();

//Get pagination Query
var getPaginationString = function(p){
	startingPoint = ((p.page-1) * p.dataPerPage);
	s = " LIMIT "+ startingPoint + ", "+ p.dataPerPage;
	return s;
};

//Count how many entries Student have for pagination
var getNumEntries = function(stringWhere, callback){
	mysql.execute("select count(*) as numEntries from T_LECTURE l, T_SCHEDULE_CLASS sc, T_CLASS c, T_SUBJECT s, T_SCHEDULE sch " + stringWhere + ";", function(result){
            callback(result[0].numEntries);
    });
};

//Get all
router.get('/getAll', function(req, res){
    mysql.execute("select * from T_LECTURE;", function(result){
		res.json({success:true, data:result});
    });
});

//Get by id
router.get('/get/:id', function(req, res){
	var id = req.params.id;
	string = "select l.ID, c.ID as ID_CLASS, l.DAT_DAY_OF_LECTURE, s.ID as ID_SUBJECT, s.TXT_NAME, c.NUM_CLASS, c.TXT_SEMESTER, sch.TXT_DAY, sch.DAT_BEGINNING, sch.DAT_END"
	string+= " from T_LECTURE l, T_SCHEDULE_CLASS sc, T_CLASS c, T_SUBJECT s, T_SCHEDULE sch";
	string+= " where l.ID_SCHEDULE_CLASS = sc.ID and sc.ID_CLASS = c.ID and sc.ID_SCHEDULE = sch.ID and c.ID_SUBJECT = s.ID and l.ID = " + id;
	mysql.execute(string, function(result){
		if(result.length == 0){
			res.json({success:false, data:"Something is wrong. it seems like this lecture do not exist in the DB. Please talk to the Admin."});
		}
		res.json({success: true, data:result});
	});
});

//Get by Filter
router.post('/getFilter', function(req, res){
	var filter = req.body;
	filter.pagination = {page:filter.page, dataPerPage:filter.dataPerPage}
	string = "select l.ID, l.DAT_DAY_OF_LECTURE, sc.ID_CLASS, s.TXT_NAME, c.NUM_CLASS, c.TXT_SEMESTER, sch.TXT_DAY, sch.DAT_BEGINNING, sch.DAT_END"
	string+= " from T_LECTURE l, T_SCHEDULE_CLASS sc, T_CLASS c, T_SUBJECT s, T_SCHEDULE sch";
	stringOrderBy = " order by l.DAT_DAY_OF_LECTURE, s.TXT_NAME, c.TXT_SEMESTER, c.NUM_CLASS"
	stringWhere = " where l.ID_SCHEDULE_CLASS = sc.ID and sc.ID_CLASS = c.ID and sc.ID_SCHEDULE = sch.ID and c.ID_SUBJECT = s.ID";
	stringPag = getPaginationString(filter.pagination);
	if(filter.begin != null && filter.begin != ""){
		stringWhere += " and DATE(l.DAT_DAY_OF_LECTURE) >= DATE('"+ filter.begin + "')";
	}
	if(filter.end != null && filter.end != ""){
        stringWhere += " and DATE(l.DAT_DAY_OF_LECTURE) <= DATE('"+ filter.end + "')";
    }
	if(filter.classSubject != null && filter.classSubject != ""){
        stringWhere += " and s.ID = "+ filter.classSubject;
    }
	if(filter.numClass != null && filter.numClass != ""){
        stringWhere += " and c.NUM_CLASS ="+ filter.numClass;
    }
	if(filter.includePast != null && filter.includePast != "" && filter.includePast == 0){
        stringWhere += " and DATE(l.DAT_DAY_OF_LECTURE) >= DATE(NOW())";
    }
	mysql.execute(string+stringWhere+stringOrderBy+stringPag+";", function(result){
		entries = getNumEntries(stringWhere, function(numEntries){
            res.json({success:true, data:result, numEntries:numEntries});
        });
    });
});

//Delete (Logical) by id
router.post("/delete/:id", function(req, res){
	var id = req.params.id;
	mysql.execute("delete from T_LECTURE where ID = " + id + ";", function(result){
		res.json(result);
	});
});

//Check if already exists
router.post('/checkIfExists', function(req, res){
	lecture = req.body;
	string = "select * from T_LECTURE l, T_SCHEDULE_CLASS sc, T_CLASS c, T_SCHEDULE sch";
	string+= " where l.ID_SCHEDULE_CLASS = sc.ID and sc.ID_CLASS = c.ID and sc.ID_SCHEDULE = sch.ID";
	string+= " and c.ID_SUBJECT =" + lecture.classSubject;
	string+= " and sc.ID_CLASS =" + lecture.numClass;
	string+= " and TIME(l.DAT_DAY_OF_LECTURE) = TIME('" + lecture.date + "')";
	mysql.execute(string, function(result){
		res.json(result);
	});
});

//Save to Database
router.post('/save', function(req, res){
	data = req.body;

	//Error Handling
	if (data.classSubject == null || data.classSubject == ""){
		res.json({success: false, data:"Subject is missing."});
		return;
	}
	if (data.numClass == null || data.numClass == ""){
        res.json({success: false, data:"Class Number is missing."});
        return;
    }
	if (data.date == null || data.date == ""){
        res.json({success: false, data:"Date is missing."});
        return;
    }

	string = "select sc.ID from T_SCHEDULE_CLASS sc, T_SCHEDULE s, T_CLASS c where sc.ID_SCHEDULE = s.ID and sc.ID_CLASS = c.ID";
	string+= " and c.ID_SUBJECT = " + data.classSubject;
	string+= " and c.ID = " + data.numClass;
	string+= " and s.TXT_DAY = '" + data.day + "'";
	string+= ";"

	mysql.execute(string, function(value){
		if(value.length < 1){
			res.json({success: false, data:"This Class do not have lectures on this day."});
			return;
		}
		else{
			scheduleClassId = value[0].ID;
			if(data.id == undefined || data.id == "" || data.id == null){
				mysql.execute("insert into T_LECTURE values(0, " + scheduleClassId + ", '"+ data.date + "');", function(result){
					res.json({success: true, data:result});
				});
			}
			else {
				mysql.execute("update T_LECTURE set ID_SCHEDULE_CLASS=" + scheduleClassId + ", DAT_DAY_OF_LECTURE='"+ data.date + "' where ID = "+ data.id + ";", function(result){
					res.json({success: true, data:result});
				});
			}
		}
	});
});

module.exports = router;