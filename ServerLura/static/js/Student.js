$(document).ready(function(){
	getAll();
});

var searchFilter = function(){
	var filter = {};
	filter.name = $("#search-name").val();
    filter.matriculation = $("#search-matriculation").val();
	filter.card = $("#search-card").val();
	console.log(filter);
	$.blockUI();
	$.post("/Student/getFilter", filter, function(response){
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
	$.get("/Student/getAll", function(response){
		fillTable(response);
		$.unblockUI();
	});
};

var openModal = function(id){
	clearModal();
	if(id != undefined){
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
        string += "<td><img style='cursor:pointer;' onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
        string += "<td><img style='cursor:pointer;' onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
        string += "</tr>";
    });
    $("#tbody").html(string);
};

var closeModal = function(){
	$("#mainModal").modal("hide");
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
	$.post("/Student/save", student, function(data, status){
		if(data.success != true){
			toastr.error(data.data);
			$.unblockUI();
			return;
		}
		toastr.success("Student " + student.name + " was saved successfuly!");
		$.unblockUI();
		closeModal();
		getAll();
	});
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Student?", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Student/delete/"+id, id, function(data, status){
				toastr.success("Student removed successfuly.");
				$.unblockUI();
				getAll();
			});
		}
	});
};
