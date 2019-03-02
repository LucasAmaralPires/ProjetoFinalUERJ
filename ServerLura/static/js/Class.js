var pagination = {page: 1, dataPerPage: 15};
var totalPages = 0;
var subjects = [];
var actualSubjectId = null;
var actualNumClass = null;
var actualSemester = null;

$(document).ready(function(){
	getSubject(function(){
		searchFilter(true);
	})
});

var getSubject = function(callback){
	$.get("/Subject/getAll", function(response){
		subjects = response.data;
		prepareSubjectSelect();
		callback();
	});
};

var prepareSubjectSelect = function(){
	string = "<option value=''>Choose one...</option>";
	$.each(subjects, function(index, value){
        string += "<option value='"+ value.ID +"'>"+ value.TXT_NAME +"</option>";
    });
	$("#search-subject").html(string);
	$("#info-modal-subject").html(string);
};

var getSubjectName = function(id){
	response = subjects.find(x => x.ID === id).TXT_NAME;
	return response;
};

var viewClass = function(id){
	toastr.success("view Class with id = "+id);
};

var searchFilter = function(restartPage){
	var filter = {};
	filter.idSubject = $("#search-subject").children("option:selected").val();
    filter.numClass = $("#search-numClass").val();
	filter.semester = $("#search-semester").val();
	if(restartPage == true)
		pagination.page = 1;
	filter.dataPerPage = pagination.dataPerPage;
	filter.page = pagination.page;
	$.blockUI();
	$.post("/Class/getFilter", filter, function(response){
		//console.log(response);
		fillTable(response);
		$.unblockUI();
	});
};

var cleanFilter = function(){
    $("#search-subject").val("");
    $("#search-numClass").val("");
    $("#search-semester").val("");
	searchFilter();
};

var getAll = function(){ //OBSOLETE
	$.blockUI();
	$.post("/Class/getAll", pagination, function(response){
		//console.log(response)
		fillTable(response);
		$.unblockUI();
	});
};

var openModal = function(id){
	clearModal();
	$("#modalTitle").html("New Class");
	actualSubjectId = null;
	actualNumClass = null;
	actualSemester = null;
	if(id != undefined){
		$("#modalTitle").html("Edit Class");
		$.blockUI();
		$.get("/Class/get/"+id, function(response){
			if (response.success != true){
				toastr.error(response.data);
				return;
			}
			response = response.data[0];
			$("#info-modal-id").val(response.ID);
			$("#info-modal-subject").val(response.ID_SUBJECT);
			$("#info-modal-numClass").val(response.NUM_CLASS);
			actualSubjectId = response.ID_SUBJECT;
			actualNumClass = response.NUM_CLASS;
			actualSemester = response.TXT_SEMESTER;
			$("#info-modal-semester").val(response.TXT_SEMESTER);
			$.unblockUI();
		});
	}
	$("#mainModal").modal("show");
};

var fillTable = function(response){
	string = "";
    $.each(response.data, function(index, value){
		subjectName = getSubjectName(value.ID_SUBJECT);
        string += "<tr>";
        string += "<td>" + subjectName + "</td>";
        string += "<td>" + value.NUM_CLASS + "</td>";
		string += "<td>" + value.TXT_SEMESTER + "</td>";
		string += "<td><a href='viewClass.html?id=" + value.ID + "'><img style='cursor:pointer;' src='../../icons/cog.svg' alt='View' height='16' width='16'></td></a>";
        string += "<td><img style='cursor:pointer;' onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
        string += "</tr>";
    });
    $("#tbody").html(string);
	$("#numEntries").html("Classes Found: " + response.numEntries);

	$("#actualPage").html("Page: " + pagination.page);
	totalPages = Math.ceil(response.numEntries/pagination.dataPerPage);
	$("#totalPage").html("/" + totalPages);
	if(totalPages < 2)
        $("#pagination").hide();
    else
        $("#pagination").show();
};

var closeModal = function(){
	$("#mainModal").modal("hide");
};

var clearModal = function(){
	$("#info-modal-id").val("")
	$("#info-modal-subject").val("");
	$("#info-modal-numClass").val("");
	$("#info-modal-semester").val("");
};

var save = function(){
	data = {};
	data.id = $("#info-modal-id").val();
	data.subjectId = $("#info-modal-subject").children("option:selected").val();
	data.numClass = $("#info-modal-numClass").val();
	data.semester = $("#info-modal-semester").val();
	$.blockUI();
	$.post("/Class/checkIfExists", data, function(entries, status){
		alreadyExists = entries.length > 0 ? true : false;
		if(alreadyExists == true && actualSubjectId != data.subjectId && actualNumClass != data.numClass && actualSemester != data.semester){
			toastr.error("The Subject with the Number Class "+ data.numClass + " and Semester " + data.semester + " already exists.");
			$.unblockUI();
			return;
		} else{
			$.post("/Class/save", data, function(response, status){
				if(response.success != true){
					toastr.error(response.data);
					$.unblockUI();
					return;
				}
				toastr.success("Class was saved successfuly!");
				$.unblockUI();
				closeModal();
				searchFilter(false);
			});
		};
	});
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Class?", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Class/delete/"+id, id, function(data, status){
				toastr.success("Class removed successfuly.");
				$.unblockUI();
				searchFilter(false);
			});
		};
	});
};

var previousPage = function(){
	if(pagination.page != 1){
		pagination.page--;
		searchFilter(false);
	}
};

var nextPage = function(){
	if(pagination.page != totalPages){
		pagination.page++;
		searchFilter(false);
	}
};

var goToPage = function(){
	page = $("#goToInput").val();
	if(page != pagination.page && page <= totalPages && page > 0){
		pagination.page = page;
		searchFilter(false);
	} else if(page > totalPages){
		toastr.error("Page " + totalPages + " is the last page.")
	}
};
