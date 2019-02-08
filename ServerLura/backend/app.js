const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

//BODY PARSER BEGIN
//Necessary to do POST Requests in the project
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
//BODY PARSER END

//CALLING STATIC BEGIN
//This give node access to all static files (html, css, js)
app.use("/static", express.static(path.join(__dirname, "../static")));
//CALLING STATIC END

//CONTROLLERS BEGIN
//Each Entity has it own .js file named 'Controller' to tell what paths it has and what those does.
const StudentController = require('./Controllers/StudentController.js');
app.use('/Student', StudentController);

const TeacherController = require('./Controllers/TeacherController.js');
app.use('/Teacher', TeacherController);

const SubjectController = require('./Controllers/SubjectController.js');
app.use('/Subject', SubjectController);

const ClassroomController = require('./Controllers/ClassroomController.js');
app.use('/Classroom', ClassroomController);

const ScheduleController = require('./Controllers/ScheduleController.js');
app.use('/Schedule', ScheduleController);

const ClassController = require('./Controllers/ClassController.js');
app.use('/Class', ClassController);

//const LectureController = require('./Controllers/LectureController.js');
//app.use('/Lecture', LectureController);

//const AttendenceController = require('./Controllers/AttendenceController.js');
//app.use('/Attendence', AttendenceController);

//CONTROLLERS END

//INDEX CALL BEGIN
//Basically when you access the localhost:8080 you will be redirected to the index page of Lura.
app.get('/', function(request, response){
	//response.sendfile('./static/html/index.html');
	response.redirect('./static/html/index.html');
});
//INDEX CALL END

module.exports = app;
