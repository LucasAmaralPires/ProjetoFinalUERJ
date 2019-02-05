var pagination = {page: 1, dataPerPage: 15};
var totalPages = 0;
var actualBegin = null;
var actualEnd = null;
var actualDay = null;

$(document).ready(function(){
	$('.clockpicker').clockpicker({
		donetext: "Done",
		autoclose: true
	});
    searchFilter(true);
});

var searchFilter = function(restartPage){
	var filter = {};
	filter.begin = $("#search-begin").val();
	filter.end = $("#search-end").val();
    filter.day = $("#search-day").children("option:selected").val();
	filter.card = $("#search-description").val();
	if(restartPage == true)
		pagination.page = 1;
	filter.dataPerPage = pagination.dataPerPage;
	filter.page = pagination.page;
	$.blockUI();
	$.post("/Schedule/getFilter", filter, function(response){
		//console.log(response);
		fillTable(response);
		$.unblockUI();
	});
};

var cleanFilter = function(){
    $("#search-begin").val("");
    $("#search-end").val("");
    $("#search-day").val("");
	$("#search-description").val("");
	searchFilter();
};

var getAll = function(){ //OBSOLETE
	$.blockUI();
	$.post("/Schedule/getAll", pagination, function(response){
		//console.log(response)
		fillTable(response);
		$.unblockUI();
	});
};

var openModal = function(id){
	clearModal();
	$("#modalTitle").html("New Schedule");
	actualBegin = null;
	actualEnd = null;
	actualDay = null;
	if(id != undefined){
		$("#modalTitle").html("Edit Schedule");
		$.blockUI();
		$.get("/Schedule/get/"+id, function(response){
			if (response.success != true){
				toastr.error(response.data);
				return;
			}
			response = response.data[0];
			$("#info-modal-id").val(response.ID);
			$("#info-modal-begin").val(response.DAT_BEGINNING);
			$("#info-modal-end").val(response.DAT_END);
			$("#info-modal-day").val(response.TXT_DAY);
			actualBegin = response.DAT_BEGINNING;
			actualEnd = response.DAT_END;
			actualDay = response.TXT_DAY;
			$("#info-modal-description").val(response.TXT_DESCRIPTION);
			$.unblockUI();
		});
	}
	$("#mainModal").modal("show");
};

var fillTable = function(response){
	string = "";
    $.each(response.data, function(index, value){
        string += "<tr>";
        string += "<td>" + value.TXT_DAY + "</td>";
        string += "<td>" + value.DAT_BEGINNING + "</td>";
		string += "<td>" + value.DAT_END + "</td>";
        string += "<td>" + value.TXT_DESCRIPTION + "</td>";
        string += "<td><img style='cursor:pointer;' onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
        string += "</tr>";
    });
    $("#tbody").html(string);
	$("#numEntries").html("Schedules Found: " + response.numEntries);

	$("#actualPage").html("Page: " + pagination.page);
	totalPages = Math.ceil(response.numEntries/pagination.dataPerPage);
	$("#totalPage").html("/" + totalPages);
};

var closeModal = function(){
	$("#mainModal").modal("hide");
};

var clearModal = function(){
	$("#info-modal-id").val("")
	$("#info-modal-begin").val("");
	$("#info-modal-end").val("");
	$("#info-modal-day").val("");
	$("#info-modal-description").val("");
};

var save = function(){
	schedule = {};
	schedule.id = $("#info-modal-id").val();
	schedule.begin = $("#info-modal-begin").val();
	schedule.end = $("#info-modal-end").val();
	schedule.day = $("#info-modal-day").val();
	schedule.description = $("#info-modal-description").val();
	$.blockUI();
	$.post("/Schedule/checkIfExists", schedule, function(data, status){
		alreadyExists = data.length > 0 ? true : false;
		if(alreadyExists == true){
			if(data[0].ID != schedule.id){
				toastr.error("The Schedule already exists.");
				$.unblockUI();
				return;
			}
		} else{
			$.post("/Schedule/save", schedule, function(data, status){
				if(data.success != true){
					toastr.error(data.data);
					$.unblockUI();
					return;
				}
				toastr.success("Schedule was saved successfuly!");
				$.unblockUI();
				closeModal();
				searchFilter(false);
			});
		};
	});
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Schedule?", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Schedule/delete/"+id, id, function(data, status){
				toastr.success("Schedule removed successfuly.");
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
