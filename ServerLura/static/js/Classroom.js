var pagination = {page: 1, dataPerPage: 15};
var totalPages = 0;
var actualRoom = null;

$(document).ready(function(){
    searchFilter(true);
});

var searchFilter = function(restartPage){
	var filter = {};
	filter.room = $("#search-room").val();
    filter.restrict = $("#search-restrict").children("option:selected").val();
	if(restartPage == true)
		pagination.page = 1;
	filter.dataPerPage = pagination.dataPerPage;
	filter.page = pagination.page;
	$.blockUI();
	$.post("/Classroom/getFilter", filter, function(response){
		//console.log(response);
		fillTable(response);
		$.unblockUI();
	});
};

var cleanFilter = function(){
    $("#search-room").val("");
    $("#search-restrict").val("");
	searchFilter();
};

var getAll = function(){ //OBSOLETE
	$.blockUI();
	$.post("/Classroom/getAll", pagination, function(response){
		//console.log(response)
		fillTable(response);
		$.unblockUI();
	});
};

var openModal = function(id){
	clearModal();
	$("#modalTitle").html("New Classroom");
	actualRoom = null;
	if(id != undefined){
		$("#modalTitle").html("Edit Classroom");
		$.blockUI();
		$.get("/Classroom/get/"+id, function(response){
			if (response.success != true){
				toastr.error(response.data);
				return;
			}
			response = response.data[0];
			$("#info-modal-id").val(response.ID);
			$("#info-modal-room").val(response.TXT_ROOM);
			response.FL_RESTRICT == 1 ? $("#info-modal-restrict").prop('checked', true) : $("#info-modal-restrict").prop('checked', false);
			actualRoom = response.TXT_ROOM;
			$.unblockUI();
		});
	}
	$("#mainModal").modal("show");
};

var fillTable = function(response){
	string = "";
    $.each(response.data, function(index, value){
        isRestrict = value.FL_RESTRICT != "" ? "Yes" : "No";
        string += "<tr>";
        string += "<td>" + value.TXT_ROOM + "</td>";
        string += "<td>" + isRestrict + "</td>";
		string += "<td><img style='cursor:pointer;' onclick = 'seeClasses(" + value.ID +")' src='../../icons/menu.svg' alt='See Classes' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
        string += "</tr>";
    });
    $("#tbody").html(string);
	$("#numEntries").html("Classrooms Found: " + response.numEntries);

	$("#actualPage").html("Page: " + pagination.page);
	totalPages = Math.ceil(response.numEntries/pagination.dataPerPage);
	$("#totalPage").html("/" + totalPages);
	if(totalPages < 2)
        $("#pagination").hide();
    else
        $("#pagination").show();
};

var seeClasses = function(id){
	$.blockUI();
    $.get("/Classroom/getClasses/"+id, function(response){
		if(response.success == false)
			toastr.info(response.data);
		else{
			$("#tbodyClass").html(""); //Equivalente a um clearModal();
			string = "";
			$.each(response.data, function(index, value){
				string += "<tr>";
				string += "<td>" + value.TXT_NAME + "</td>";
				string += "<td>" + value.NUM_CLASS + "</td>";
				string += "<td>" + value.TXT_SEMESTER + "</td>";
				string += "<td><a href='../Class/viewClass.html?id=" + value.ID + "'><img style='cursor:pointer;' src='../../icons/arrow-circle-right.svg' alt='See Class' height='16' width='16'></a></td>";
				string += "</tr>";
			});
			$("#tbodyClass").html(string);
			$("#modalClass").modal("show");
		}
        $.unblockUI();
    });
};

var closeModal = function(){
	$("#mainModal").modal("hide");
	$("#modalClass").modal("hide");
};

var clearModal = function(){
	$("#info-modal-id").val("")
	$("#info-modal-room").val("");
	$("#info-modal-restrict").prop('checked', false);
};

var save = function(){
	classroom = {};
	classroom.id = $("#info-modal-id").val();
	classroom.room = $("#info-modal-room").val();
	classroom.restrict = $("#info-modal-restrict").is(":checked") == true ? 1 : 0;
	$.blockUI();
	$.post("/Classroom/checkIfExists", classroom, function(data, status){
		alreadyExists = data.length > 0 ? true : false;
		if(alreadyExists == true && actualRoom != classroom.room){
			toastr.error("The Room " + classroom.room + " already exists.");
			$.unblockUI();
			return;
		} else{
			$.post("/Classroom/save", classroom, function(data, status){
				if(data.success != true){
					toastr.error(data.data);
					$.unblockUI();
					return;
				}
				toastr.success("Classroom " + classroom.room + " was saved successfuly!");
				$.unblockUI();
				closeModal();
				searchFilter(false);
			});
		};
	});
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Classroom?<br><br>It will be also deleted from all Classes.", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Classroom/delete/"+id, id, function(data, status){
				toastr.success("Classroom removed successfuly.");
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
