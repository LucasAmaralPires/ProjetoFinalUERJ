classId = window.location.search.substring(4);
actualEntity = "";
classSchedules = {classId: classId, page: 1, dataPerPage: 999};

var pagination = {};
pagination.student = {page: 1, dataPerPage: 5};
pagination.teacher = {page: 1, dataPerPage: 5};
pagination.schedule = {page: 1, dataPerPage: 5};
pagination.classroom = {page: 1, dataPerPage: 5};

var totalPages = {};
totalPages.student = 0;
totalPages.teacher = 0;
totalPages.schedule = 0;
totalPages.classroom = 0;

var students = [];
var teachers = [];
var schedules = [];
var classrooms = [];

$(document).ready(function(){
	preparePage(function(){
		prepareEntity("Student", true, function(){
			prepareEntity("Teacher", true, function(){
				prepareEntity("Classroom", true, function(){
					prepareEntity("Schedule", true, function(){
						$.get("/Class/getInfo/"+classId, function(response){
							//console.log(response);
							$("#title-screen").html("<b>" +response.data[0].TXT_NAME + ": " + response.data[0].NUM_CLASS + " - " + response.data[0].TXT_SEMESTER + "</b>");
						});
					});
				})
			})
		});
	});
});

var prepareEntity = function(entity, restartPage, callback){
	data = {};
	if (entity == "Student"){
		if(restartPage == true)
			pagination.student.page = 1;
		data = {classId: classId, page: pagination.student.page, dataPerPage: pagination.student.dataPerPage}
	}
    if (entity == "Teacher"){
        if(restartPage == true)
            pagination.teacher.page = 1;
        data = {classId: classId, page: pagination.teacher.page, dataPerPage: pagination.teacher.dataPerPage}
	}
    if (entity == "Classroom"){
        if(restartPage == true)
            pagination.classroom.page = 1;
        data = {classId: classId, page: pagination.classroom.page, dataPerPage: pagination.classroom.dataPerPage}
	}
    if (entity == "Schedule"){
        if(restartPage == true)
            pagination.schedule.page = 1;
        data = {classId: classId, page: pagination.schedule.page, dataPerPage: pagination.schedule.dataPerPage}
	}

	$.post("/Class/getAllEntity/"+entity, data, function(response, status){
		fillTable(entity, response);
		if(typeof callback === "function")
			callback();
	});
};

var preparePage = function(callback){
	$.get("/Student/getAll", function(response){
		students = response.data;
		$.get("/Teacher/getAll", function(response){
			teachers = response.data;
			$.get("/Schedule/getAll", function(response){
				schedules = response.data;
				$.get("/Classroom/getAll", function(response){
					classrooms = response.data;
					callback();
				});
			});
		});
	});
};

var openModal = function(entity){
	actualEntity = entity;
    $("#info-modal").val("");
    $("#modalTitle").html("Add " + entity);
    prepareEntitySelect(entity);
    $("#mainModal").modal("show");
};

var openModalLecture = function(){
	fillInfoDays();
	$("#modalLecture").modal("show");
};

var fillInfoDays = function(){
    $("#info-modal-infoDays").html("");
	$.blockUI();
	$.get("/Schedule/getByClass/" + classId, function(response){
		classSchedules.data = response.data;
		string = "<b>Class Schedules:</b><br>";
		$.each(response.data, function(index, value){
			string+= value.TXT_DAY + " (" + value.DAT_BEGINNING + " - " + value.DAT_END + ")<br>";
		});
		$("#info-modal-infoDays").html(string);
		$.unblockUI();
	});
};

var createLectures = function(){
	if($("#info-modal-from").val() == "" || $("#info-modal-from").val() == null || $("#info-modal-to").val() == "" || $("#info-modal-to").val() == null){
        toastr.error("Please choose a Date.");
        return;
    }
	if($("#info-modal-from").val() > $("#info-modal-to").val()){
		toastr.error("Date From needs to be before Date To.");
		return;
	}
	$.blockUI();
	$.post("/Class/getAllEntity/Schedule", classSchedules, function(response, status){
		responseArray = [];
		$.each(response.data, function(index, value){
			responseArray.push({scheduleClassId: value.ID, day: classSchedules.data[index].TXT_DAY});
		});
		classSchedules.arraySchedules = JSON.stringify(responseArray);
		classSchedules.from = $("#info-modal-from").val();
		classSchedules.to = $("#info-modal-to").val();
		//console.log(classSchedules);
		$.post("/Lecture/createMass", classSchedules, function(response, status){
			toastr.success("Lectures created successfuly!");
			$.unblockUI();
			closeModal();
			return;
		});
	});
};

var prepareEntitySelect = function(entity){
	//uppercase = entity.toUpperCase();
	string = "<option value=''>Choose one...</option>";
	if(entity == "Student")
		$.each(students, function(index, value){string += "<option value='"+ value.ID +"'>"+ value.TXT_NAME +"</option>";});
	if(entity == "Teacher")
        $.each(teachers, function(index, value){string += "<option value='"+ value.ID +"'>"+ value.TXT_NAME +"</option>";});
	if(entity == "Schedule")
        $.each(schedules, function(index, value){string += "<option value='"+ value.ID +"'>"+ value.TXT_DAY + ": " + value.DAT_BEGINNING + " - " + value.DAT_END +"</option>";});
	if(entity == "Classroom")
        $.each(classrooms, function(index, value){string += "<option value='"+ value.ID +"'>"+ value.TXT_ROOM +"</option>";});
	$("#info-modal").html(string);
};

var getEntityInfo = function(entity, data, entityId){
	response = {};
	if(data != null){
		if(entity == "Student")
			response = students.find(x => x.ID === data.ID_STUDENT);
		if(entity == "Teacher")
			response = teachers.find(x => x.ID === data.ID_TEACHER);
		if(entity == "Classroom")
			response = classrooms.find(x => x.ID === data.ID_CLASSROOM);
		if(entity == "Schedule")
			response = schedules.find(x => x.ID === data.ID_SCHEDULE);
	}
	else if(entityId != null || entityId != undefined){
		if(entity == "Student")
            response = students.find(x => x.ID === entityId);
        if(entity == "Teacher")
            response = teachers.find(x => x.ID === entityId);
        if(entity == "Classroom")
            response = classrooms.find(x => x.ID === entityId);
        if(entity == "Schedule")
            response = schedules.find(x => x.ID === entityId);
	}
	return response;
};

var fillTable = function(entity, response){
	string = "";
    $.each(response.data, function(index, value){
		entityInfo = getEntityInfo(entity, value);
        string += "<tr>";
		if(entity == "Student" || entity == "Teacher"){
			string += "<td>" + entityInfo.TXT_NAME + "</td>";
			string += "<td>" + entityInfo.NUM_MATRICULATION + "</td>";
		}
		else if (entity == "Classroom"){
			isRestrict = entityInfo.FL_RESTRICT == 1 ? "Yes" : "No";
            string += "<td>" + entityInfo.TXT_ROOM + "</td>";
            string += "<td>" + isRestrict + "</td>";
		}
		else if (entity == "Schedule"){
            string += "<td>" + entityInfo.TXT_DAY + "</td>";
            string += "<td>" + entityInfo.DAT_BEGINNING + " - " + entityInfo.DAT_END + "</td>";
		}
        string += "<td><img style='cursor:pointer;' onclick = 'remove(\"" + entity + "\", " + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
        string += "</tr>";
    });
	modalTitle = entity;
	entity = entity.toLowerCase();
    $("#tbody-"+entity).html(string);
	$("#numEntries-"+entity).html(modalTitle + " (" + response.numEntries + ")");

	entityPagination = {};
	entityTotalPages = {};
	if(entity == "student"){
		entityPagination = pagination.student;
		entityTotalPages = totalPages.student;
	}
    else if(entity == "teacher"){
        entityPagination = pagination.teacher;
        entityTotalPages = totalPages.teacher;
    }
    else if(entity == "classroom"){
        entityPagination = pagination.classroom;
        entityTotalPages = totalPages.classroom;
    }
    else if(entity == "schedule"){
        entityPagination = pagination.schedule;
        entityTotalPages = totalPages.schedule;
    }

	$("#actualPage-"+entity).html("Page: " + entityPagination.page);
	entityTotalPages = Math.ceil(response.numEntries/entityPagination.dataPerPage);
	$("#totalPage-"+entity).html("/" + entityTotalPages);
	if(entityTotalPages < 2)
        $("#pagination-"+entity).hide();
    else
        $("#pagination-"+entity).show();
};

var closeModal = function(){
	$("#mainModal").modal("hide");
	$("#modalLecture").modal("hide");
};

var save = function(){
	if($("#info-modal").children("option:selected").val() == ""){
		toastr.error("Please select one option");
		return;
	}
	data = {
		classId:classId,
		entityId:$("#info-modal").children("option:selected").val()
	};
	$.blockUI();
	$.post("/Class/checkIfExistsEntity/"+actualEntity, data, function(entries, status){
		alreadyExists = entries.length > 0 ? true : false;
		if(alreadyExists == true){
			toastr.error("Already exists");
			$.unblockUI();
			return;
		} else{
			$.post("/Class/saveEntity/"+actualEntity, data, function(response, status){
				if(response.success != true){
					toastr.error(response.data);
					$.unblockUI();
					return;
				}
				toastr.success(actualEntity + " was saved successfuly!");
				$.unblockUI();
				prepareEntity(actualEntity, false);
				closeModal();
			});
		};
	});
};

var remove = function(entity, entityId){
	bootbox.confirm("Do you want to remove this " + entity + " from Class?", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Class/deleteEntity/" + entity + "/" + entityId, function(data, status){
				toastr.success("Removed " + entity + " from Class successfuly.");
				$.unblockUI();
				prepareEntity(entity, true)
			});
		};
	});
};

var previousPage = function(entity){
	if(entity == "Student" && pagination.student.page != 1)
		pagination.student.page--;
	else if(entity == "Teacher" && pagination.teacher.page != 1)
		pagination.teacher.page--;
	else if(entity == "Classroom" && pagination.classroom.page != 1)
		pagination.classroom.page--;
	else if(entity == "Schedule" && pagination.schedule.page != 1)
		pagination.schedule.page--;

	prepareEntity(entity, false);
};

var nextPage = function(entity){
	if(entity == "Student" && pagination.student.page != totalPages.student)
		pagination.student.page++;
	else if(entity == "Teacher" && pagination.teacher.page != totalPages.teacher)
		pagination.teacher.page++;
	else if(entity == "Classroom" && pagination.classroom.page != totalPages.classroom)
		pagination.classroom.page++;
	else if(entity == "Schedule" && pagination.schedule.page != totalPages.schedule)
		pagination.schedule.page++;

	prepareEntity(entity, false)
};
var goToPage = function(entity){
	page = $("#goToInput"+entity).val();

	if(entity == "Student"){
		if(page != pagination.student.page && page <= totalPages.student && page > 0){
			pagination.student.page = page;
			prepareEntity(entity, false);
		} else if(page > totalPages.student){
			toastr.error("Page " + totalPages.student + " is the last page.")
		}
	}
    if(entity == "Teacher"){
        if(page != pagination.teacher.page && page <= totalPages.teacher && page > 0){
            pagination.teacher.page = page;
            prepareEntity(entity, false);
        } else if(page > totalPages.teacher){
            toastr.error("Page " + totalPages.teacher + " is the last page.")
        }
    }
    if(entity == "Classroom"){
        if(page != pagination.classroom.page && page <= totalPages.classroom && page > 0){
            pagination.classroom.page = page;
            prepareEntity(entity, false);
        } else if(page > totalPages.classroom){
            toastr.error("Page " + totalPages.student + " is the last page.")
        }
    }
    if(entity == "Schedule"){
        if(page != pagination.schedule.page && page <= totalPages.schedule && page > 0){
            pagination.schedule.page = page;
            prepareEntity(entity, false);
        } else if(page > totalPages.schedule){
            toastr.error("Page " + totalPages.schedule + " is the last page.")
        }
    }

};
