import sys
import time
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask_assets import Bundle, Environment
from helpers import TimeMeasure, GpiStream, Logger
import threading as th

#sys.path.append('/home/pi/config')
import config as cf

reaction_time = TimeMeasure()        

# Configure the web app (needed only for autorestart)
app = Flask(__name__)
app.config.from_object(cf.FlaskConfig)
socketio = SocketIO(app)
    # Include JS files
jsfiles = Bundle('gpi_helpers.js', 'form_ajax.js', output='gen/main.js')
assets = Environment(app)
assets.register('main_js', jsfiles)

# Make a new dict with GPIs as Keys and GpiStreams as values
gpi_stream_dict = {}
def create_gpi_table( gpi_stream_dict ):
    num = 1
    for gpi, id in cf.gpi2stream.items():
        gpi_stream_dict[gpi] = GpiStream(num, id, gpi)
        num += 1
create_gpi_table(gpi_stream_dict);

# Test the logger
logger = Logger(socketio)
#logger.start()
def test_message():
    while(1):
        logger.log_message('Yo mama so fat')
        time.sleep(20)

t = th.Thread(target=test_message)
t.start()

@app.route('/')
@app.route('/command_center')
def index():
    return render_template('command_center.html', async_mode=socketio.async_mode)

@app.route('/gpis')
def get_gpis():
    inputs = []
    for gpi, input in gpi_stream_dict.items():
        inputs.append(gpi_stream_dict[gpi].__dict__)
    return jsonify(inputs)

@socketio.on('connect', namespace='')
def test_connect():
    print("Websocket connected")
    emit('my_logging', {'data': 'WebSocket Connected'})


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')