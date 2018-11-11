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
			string += "<td style='width: 10%'><img onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit' height='16' width='16'></td>";
			string += "<td><img onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete' height='16' width='16'></td>";
			string += "</tr>";
		});
		$("#tbody").html(string);
		$.unblockUI();
	});
};

var openModal = function(id){
	toastr.info("abrindo a modal com o id="+id+". Se tiver id entao esta editando, senao esta inserindo!")
	$("#mainModal").modal("show");
};

var closeModal = function(){
	$("#mainModal").modal("hide");
};
var clearModal = function(){
};

var save = function(){
	toastr.warning("Validando");
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Student?", function(response){
		if(response != ""){
			$.blockUI();
			$.post("/Student/delete/"+id, id, function(data, status){
				console.log(data);
				console.log(status);
				toastr.success("yay apagou!!!");
				$.unblockUI();
				getAll();
			});
		}
	});
};

