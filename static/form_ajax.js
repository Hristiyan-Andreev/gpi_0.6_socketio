// Make a GPI Stream class to store information about the gpi-stream mapping
class GPIStream{
    constructor(num, gpi, stream, in_cue, ch_locked){
        this.num = num;
        this.gpi = gpi;
        this.stream = stream;
        this.in_cue = in_cue;
        this.ch_locked = ch_locked;
    }

    static from_json(obj){
		// let obj = JSON.parse(json);
		console.log(obj);
        return new GPIStream(obj.num, obj.gpi, obj.stream, obj.in_cue, obj.ch_locked);
    }
}

class GPIStreamList{
    constructor(data){		
		this.gpi_stream_list = new Array(data.length);
        for (i=0; i<data.length; i++){
            this.gpi_stream_list[i] = GPIStream.from_json(data[i]);
        }
    }
}

function get_ajax(endpoint) {
	let url = location.protocol + '//' + document.domain + ':' + location.port + endpoint;
	
	return $.ajax({
		type: "GET",
		url: url,
	});
};

function show_gpi(){
	get_ajax('/gpis').done( function(data) {
		// console.log(data);
		for (i=0; i<data.length; i++){
			let row = $('<tr/>').append($('<td/>').text(data[i].gpi), 
				$('<td/>').text(data[i].stream_id));
			$('#gpi_table').prepend(row);
		}
	});
}

function get_gpis(){
	get_ajax('/gpis').done( function(data) {
		console.log(data);
		let stream_list = new GPIStreamList(data);
		console.log(stream_list);
	});
}