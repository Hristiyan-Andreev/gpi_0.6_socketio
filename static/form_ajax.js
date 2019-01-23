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

// Render GPI streams with direct AJAX call and printing the data from it
// function show_gpi(){
// 	get_ajax('/gpis').done( function(data) {
// 		// console.log(data);
// 		for (i=0; i<data.length; i++){
// 			let row = $('<tr/>').append(
// 				$('<td/>').text(data[i].num),
// 				$('<td/>').text(data[i].gpi),
// 				$('<td/>').text(data[i].stream_id),
// 				$('<td/>').html('<a href="#" class="btn btn-warning btn-sm edit">Edit</a>')
// 			);
// 			$('#gpi_table').append(row);
// 		}
// 	});
// }

// Render GPI streams with fetching and saving the streams to local storage first
function render_streams(){
	fetch_streams();
	streams = JSON.parse(localStorage.getItem('stream_list'));
	console.log(streams);	
	for (i=0; i<streams.length; i++){
		let row = $('<tr/>').append(
			$('<td/>').text(streams[i].num),
			$('<td/>').text(streams[i].gpi),
			$('<td/>').text(streams[i].stream),
			$('<td/>').html('<a href="#" class="btn btn-warning btn-sm edit">Edit</a>')
		);
		$('#gpi_table').append(row);
	}
}

function fetch_streams(){
	get_ajax('/gpis').done( function(data) {
		let stream_list = new GPIStreamList(data);
		stream_list.add_to_storage();
		// console.log(stream_list);
	});
}

function change_stream(stream_row){
	console.log(stream_row.parentElement.parentElement);
}

$(document).ready(function() {
	document.querySelector('#gpi_list').addEventListener('click', (e) => {
		change_stream(e.target);
	});
});