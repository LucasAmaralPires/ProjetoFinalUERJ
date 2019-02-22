var pagination = {page: 1, dataPerPage: 15};
var totalPages = 0;
var actualMatriculation = null;

$(document).ready(function(){
    searchFilter(true);
});

var searchFilter = function(restartPage){
	var filter = {};
	filter.name = $("#search-name").val();
    filter.matriculation = $("#search-matriculation").val();
	filter.card = $("#search-card").val();
	if(restartPage == true)
		pagination.page = 1;
	filter.dataPerPage = pagination.dataPerPage;
	filter.page = pagination.page;
	$.blockUI();
	$.post("/Student/getFilter", filter, function(response){
		//console.log(response);
		fillTable(response);
		$.unblockUI();
	});
};

var cleanFilter = function(){
    $("#search-name").val("");
    $("#search-matriculation").val("");
    $("#search-card").val("");
	searchFilter();
};

var getAll = function(){
	$.blockUI();
	$.post("/Student/getAll", pagination, function(response){
		//console.log(response)
		fillTable(response);
		$.unblockUI();
	});
};

var openModal = function(id){
	clearModal();
	$("#modalTitle").html("New Student");
	actualMatriculation = null;
	if(id != undefined){
		$("#modalTitle").html("Edit Student");
		$.blockUI();
		$.get("/Student/get/"+id, function(response){
			if (response.success != true){
				toastr.error(response.data);
				return;
			}
			response = response.data[0];
			$("#info-modal-id").val(response.ID);
			$("#info-modal-name").val(response.TXT_NAME);
			$("#info-modal-matriculation").val(response.NUM_MATRICULATION);
			actualMatriculation = response.NUM_MATRICULATION
			$("#info-modal-card").val(response.NUM_CARD);
			$.unblockUI();
		});
	}
	$("#mainModal").modal("show");
};

var fillTable = function(response){
	string = "";
    $.each(response.data, function(index, value){
        hasCard = value.NUM_CARD != "" ? "Yes" : "No";
        string += "<tr>";
        string += "<td>" + value.TXT_NAME + "</td>";
        string += "<td>" + value.NUM_MATRICULATION + "</td>";
        string += "<td>" + hasCard + "</td>";
		string += "<td><img style='cursor:pointer;' onclick = 'seeClasses(" + value.ID +")' src='../../icons/menu.svg' alt='See Classes' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
        string += "</tr>";
    });
    $("#tbody").html(string);
	$("#numEntries").html("Students Found: " + response.numEntries);

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
    $.get("/Student/getClasses/"+id, function(response){
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
	$("#info-modal-name").val("");
	$("#info-modal-matriculation").val("");
	$("#info-modal-card").val("");
};

var save = function(){
	student = {};
	student.id = $("#info-modal-id").val();
	student.name = $("#info-modal-name").val();
	student.matriculation = $("#info-modal-matriculation").val();
	student.card = $("#info-modal-card").val();
	$.blockUI();
	$.post("/Student/checkIfExists", student, function(data, status){
		alreadyExists = data.length > 0 ? true : false;
		if(alreadyExists == true && actualMatriculation != student.matriculation){
			toastr.error("The Matriculation " + student.matriculation + " already exists.");
			$.unblockUI();
			return;
		} else{
			$.post("/Student/save", student, function(data, status){
				if(data.success != true){
					toastr.error(data.data);
					$.unblockUI();
					return;
				}
				toastr.success("Student " + student.name + " was saved successfuly!");
				$.unblockUI();
				closeModal();
				searchFilter(false);
			});
		};
	});
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Student?<br><br>It will be also deleted from all Classes.", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Student/delete/"+id, id, function(data, status){
				toastr.success("Student removed successfuly.");
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
