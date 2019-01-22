// Make a GPI Stream class to store information about the gpi-stream mapping
class GPIStream{
    constructor(num, gpi, stream, in_cue, ch_locked){
        this.num = num;
        this.gpi = gpi;
        this.stream = stream;
        this.in_cue = in_cue;
        this.ch_locked = ch_locked;
    }

    static from_obj(obj){
        return new GPIStream(obj.num, obj.gpi, obj.stream, obj.in_cue, obj.ch_locked);
	}

	static from_json(json){
		let obj = JSON.parse(json);
		// console.log(obj);
        return new GPIStream(obj.num, obj.gpi, obj.stream, obj.in_cue, obj.ch_locked);
    }
}

class GPIStreamList{
    constructor(data){		
		this.gpi_stream_list = new Array(data.length);
        for (i=0; i<data.length; i++){
            this.gpi_stream_list[i] = GPIStream.from_obj(data[i]);
        }
    }
}

class GPIControl {

}

class GPIUIHandlers {
    
}