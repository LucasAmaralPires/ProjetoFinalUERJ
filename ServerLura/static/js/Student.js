$(document).ready(function(){
	$.get("/Student/getAll", function(response){
		console.log(response);
	});

});
