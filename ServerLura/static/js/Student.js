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
			string += "<td><img onclick = 'openModal(" + value.ID + ")' src='../../icons/pencil.svg' alt='Edit'></td>";
			string += "<td><img onclick = 'remove(" + value.ID + ")' src='../../icons/trash.svg' alt='Delete'></td>";
			string += "</tr>";
		});
		$("#tbody").html(string);
		$.unblockUI();
	});
};

var openModal = function(id){
	toastr.info("abrindo a modal com o id="+id+". Se tiver id entao esta editando, senao esta inserindo!")
};

var clearModal = function(){
};

var saveStudent = function(id){
};

var remove = function(id){
	bootbox.confirm("Do you want to remove this Student?", function(response){
		$.blockUI();
		$.post("/Student/delete/"+id, id, function(data, status){
			console.log(data);
			console.log(status);
			toastr.success("yay apagou!!!");
			$.unblockUI();
			getAll();
		});
	});
};

