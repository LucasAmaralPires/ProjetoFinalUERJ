var pagination = {page: 1, dataPerPage: 15};
var totalPages = 0;
var actualCode = null;
var actualName = null;

$(document).ready(function(){
    searchFilter(true);
});

var searchFilter = function(restartPage){
	var filter = {};
	filter.name = $("#search-name").val();
    filter.code = $("#search-code").val();
	filter.credits = $("#search-credits").val();
	if(restartPage == true)
		pagination.page = 1;
	filter.dataPerPage = pagination.dataPerPage;
	filter.page = pagination.page;
	$.blockUI();
	$.post("/Subject/getFilter", filter, function(response){
		//console.log(response);
		fillTable(response);
		$.unblockUI();
	});
};

var cleanFilter = function(){
    $("#search-name").val("");
    $("#search-code").val("");
    $("#search-credits").val("");
	searchFilter();
};

var getAll = function(){ //OBSOLETE
	$.blockUI();
	$.post("/Subject/getAll", pagination, function(response){
		//console.log(response)
		fillTable(response);
		$.unblockUI();
	});
};

var openModal = function(id){
	clearModal();
	$("#modalTitle").html("New Subject");
	actualCode = null;
	actualName = null;
	if(id != undefined){
		$("#modalTitle").html("Edit Subject");
		$.blockUI();
		$.get("/Subject/get/"+id, function(response){
			if (response.success != true){
				toastr.error(response.data);
				return;
			}
			response = response.data[0];
			$("#info-modal-id").val(response.ID);
			$("#info-modal-name").val(response.TXT_NAME);
			$("#info-modal-code").val(response.NUM_CODE);
			actualCode = response.NUM_CODE;
			actualName = response.TXT_NAME;
			$("#info-modal-credits").val(response.NUM_CREDITS);
			$.unblockUI();
		});
	}
	$("#mainModal").modal("show");
};

var fillTable = function(response){
	string = "";
    $.each(response.data, function(index, value){
        string += "<tr>";
        string += "<td>" + value.TXT_NAME + "</td>";
        string += "<td>" + value.NUM_CODE + "</td>";
        string += "<td>" + value.NUM_CREDITS + "</td>";
		string += "<td><img style='cursor:pointer;' onclick = 'seeClasses(" + value.ID +")' src='../../icons/menu.svg' alt='See Classes' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
        string += "</tr>";
    });
    $("#tbody").html(string);
	$("#numEntries").html("Subjects Found: " + response.numEntries);

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
    $.get("/Subject/getClasses/"+id, function(response){
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
	$("#info-modal-code").val("");
	$("#info-modal-credits").val("");
};

var save = function(){
	subject = {};
	subject.id = $("#info-modal-id").val();
	subject.name = $("#info-modal-name").val();
	subject.code = $("#info-modal-code").val();
	subject.credits = $("#info-modal-credits").val();
	$.blockUI();
	$.post("/Subject/checkIfExists", subject, function(data, status){
		alreadyExists = data.length > 0 ? true : false;
		if(alreadyExists == true && actualCode != subject.code && actualName != subject.name){
			toastr.error("The Name " + subject.name + " or the Code " + subject.code + " already exists.");
			$.unblockUI();
			return;
		} else{
			$.post("/Subject/save", subject, function(data, status){
				if(data.success != true){
					toastr.error(data.data);
					$.unblockUI();
					return;
				}
				toastr.success("Subject " + subject.name + " was saved successfuly!");
				$.unblockUI();
				closeModal();
				searchFilter(false);
			});
		};
	});
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Subject?<br><br>ALL Classes with this Subject will also be DELETED.", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Subject/delete/"+id, id, function(data, status){
				toastr.success("Subject removed successfuly.");
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
