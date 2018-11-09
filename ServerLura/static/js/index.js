$(document).ready(function(){
//	$.get("/Student/getAll", function(response){
//		console.log(response);
//	});

	$.post("/Student/save", {nome: "ANDROSS", isEmperor: true}, function(data, status){
		console.log(data);
		console.log(status);
	});
});
