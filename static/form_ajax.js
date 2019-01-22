function get_ajax(endpoint) {
	let url = location.protocol + '//' + document.domain + ':' + location.port + endpoint;
	
	return $.ajax({
		type: "GET",
		url: url,
	});
};

function post_ajax(endpoint, data) {
	let url = location.protocol + '//' + document.domain + ':' + location.port + endpoint;
	
	return $.ajax({
		type: "POST",
		data: data,
		url: url,
	});
};

function show_gpi(){
	get_ajax('/gpis').done( function(data) {
		// console.log(data);
		for (i=0; i<data.length; i++){
			let row = $('<tr/>').append(
				$('<td/>').text(data[i].num),
				$('<td/>').text(data[i].gpi),
				$('<td/>').text(data[i].stream_id),
				$('<td/>').html('<a href="#" class="btn btn-warning btn-sm edit">Edit</a>')
			);
			$('#gpi_table').append(row);
		}
	});
}

function get_gpis(){
	get_ajax('/gpis').done( function(data) {
		let stream_list = new GPIStreamList(data);
		console.log(stream_list);
	});
}

function change_stream(stream_row){
	console.log(stream_row);
}

$(document).ready(function() {
	document.querySelector('#gpi_list').addEventListener('click', (e) => {
		change_stream(e.target);
	});
});