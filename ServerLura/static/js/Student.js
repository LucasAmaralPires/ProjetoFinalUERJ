$(document).ready(function(){
	getAll();
});

getAll = function(){
	$.blockUI();
	$.get("/Student/getAll", function(response){
		string = "";
		$.each(response, function(index, value){
			hasCard = value.NUM_CARD != null ? "Yes" : "No";
			string += "<tr>";
			string += "<td>" + value.TXT_NAME + "</td>";
			string += "<td>" + value.NUM_MATRICULATION + "</td>";
			string += "<td>" + hasCard + "</td>";
			string += "<td><img style='cursor:pointer;' onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
			string += "<td><img style='cursor:pointer;' onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
			string += "</tr>";
		});
		$("#tbody").html(string);
		$.unblockUI();
	});
};

var openModal = function(id){
	clearModal();
	if(id != undefined){
		$.blockUI();
		$.get("/Student/get/"+id, function(response){
			if (response.length == 0){
				toastr.error("Something is wrong. it seems like this person do not exist in the DB. Please talk to the Admin.")
				return;
			}
			response = response[0];
			$("#info-modal-id").val(response.ID);
			$("#info-modal-name").val(response.TXT_NAME);
			$("#info-modal-matriculation").val(response.NUM_MATRICULATION);
			$("#info-modal-card").val(response.NUM_CARD);
			$.unblockUI();
		});
	}
	$("#mainModal").modal("show");
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
	try {
		$.post("/Student/save", student, function(data, status){
			toastr.success("Student " + student.name + " was saved successfuly!");
			$.unblockUI();
			closeModal();
			getAll();
		});
	}
	catch(err) {
		toastr.error(err);
	}
	finally{
		$.unblockUI();
	}
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

