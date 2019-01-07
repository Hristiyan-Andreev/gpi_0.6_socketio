$(document).ready(function() {
	$('form').submit(function (event) {
		var url = $(this).attr('action');
		var data = $('form').serializeArray();
		var btn = $(document.activeElement).attr('name');
		data.push({name: 'btn', value: btn});
		console.log(data)
		event.preventDefault(); 		// block the traditional submission of the form.		
		$.ajax({
			type: "POST",
			url: url,
			data: data, // serializes the form's elements.
			success: function (data) {
				console.log(data)  // display the returned data in the console.
			}
		});
	});
	// Inject CSRF_TOKEN as a header in the AJAX request
	var csrf_token = $('form').attr('crsf_token');
	var csrf_token = $('meta[name=csrf-token]').attr('content')
	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrf_token);
			}
		}
	});	
});