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
			$('<td/>').attr('id', 'gpi_num').text(streams[i].num),
			$('<td/>').attr('id', 'gpi_gpi').text(streams[i].gpi),
			$('<td/>').attr('id', 'gpi_stream').text(streams[i].stream),
			$('<td/>').html('<button id = "gpi_edit" class="btn btn-warning btn-sm edit-str-btn">Edit</button>')
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
	// console.log(stream_row.parentElement.parentElement.querySelector("#gpi_num").innerText);

	// Fetch all data for the current stream to be edited
	let gpi_row = stream_row.parentElement.parentElement;
	let gpi_num = gpi_row.querySelector("#gpi_num").innerText;
	let gpi_gpi = gpi_row.querySelector("#gpi_gpi").innerText;
	let gpi_stream = gpi_row.querySelector("#gpi_stream").innerText;
	
	// Generate a form for stream editing and append it before the streams table
	let edit_stream_form = $('<form/>').attr({id: 'gpi_edit_form', action: ''
	, class: "form-inline"})
	.append(
		'' + gpi_num + ' ',
		$('<div/>').attr({class: 'form-group'}).append(
			'<input type="text" class = "form-control" name="gpi_gpi" placeholder = GPI_' + gpi_gpi + ' >',
		),
		$('<div/>').attr({class: 'form-group'}).append(
			'<input type="text" class = "form-control" name="gpi_stream" placeholder = StreamID_' + gpi_stream + ' >'
		),
		'<button id = "update" class="btn btn-success btn-sm">Update</button>',
		'<button id = "cancel" class="btn btn-danger btn-sm">Cancel</button>',
	)

	$('#gpi_table_area').prepend(
		$('<div/>').attr({class: 'form-group row'}).append(edit_stream_form)
	);

	$('#gpi_edit_form').submit(function (event) {
		event.preventDefault();
		console.log('SUBMITTED')
		$(this).parent().fadeOut(300, function(){$(this).remove()});
		// $(this).parent().remove();
	});

	
	return 0;
	// gpi_row.querySelector('#gpi_gpi').innerHTML='<input type="text" name="gpi_gpi" placeholder = ' +
	// gpi_gpi + ' >';
}

// $('#gpi_edit').click( function () {
// 	console.log('Perkele');
// 	console.log($(this));
// });

$(document).ready(function() {
	document.querySelector('#gpi_list').addEventListener('click', (e) => {
		if(e.target.attributes.id.value === 'gpi_edit'){
			console.log('perkele')
			change_stream(e.target);
		}
		return 0;
	});
	
	
});
