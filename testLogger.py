import sys
import time
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask_assets import Bundle, Environment
from helpers import TimeMeasure, GpiStream, Logger
import threading as th

#sys.path.append('/home/pi/config')
import config as cf

reaction_time = TimeMeasure()        

# Configure the web app
app = Flask(__name__)
app.config.from_object(cf.FlaskConfig)
socketio = SocketIO(app)
    # Include JS files
jsfiles = Bundle('socket_io.js', 'form_ajax.js', output='gen/main.js')
assets = Environment(app)
assets.register('main_js', jsfiles)

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
def index():
    return render_template('command_center.html', async_mode=socketio.async_mode)

@socketio.on('connect', namespace='')
def test_connect():
    print("Websocket connected")
    emit('my_logging', {'data': 'WebSocket Connected'})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')