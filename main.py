import sys
import time
import RPi.GPIO as GPIO
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask_assets import Bundle, Environment
from helpers import TimeMeasure, GpiStream


#sys.path.append('/home/pi/config')
import config as cf


reaction_time = TimeMeasure()        

# Configure the web app (needed only for autorestar)
app = Flask(__name__)
app.config.from_object(cf.FlaskConfig)
socketio = SocketIO(app)
    # Include JS files
jsfiles = Bundle('socket_io.js', 'form_ajax.js', output='gen/main.js')
assets = Environment(app)
assets.register('main_js', jsfiles)

# Make a new dict with GPIs as Keys and GpiStreams as values
gpi_stream_dict = {}
for gpi, id in cf.gpi2stream.items():
    gpi_stream_dict[gpi] = GpiStream(id)


# Setup GPIO inputs/outputs
    #Use Board pin numbering - etc. (12) in pinout command
GPIO.setmode(GPIO.BCM)
    #Setup GPIOs as inputs with PULL-UP
for GPI in list(cf.gpi2stream):
    GPIO.setup( GPI, GPIO.IN, pull_up_down=GPIO.PUD_UP )


# Define callbacks

# Start cue on Falling edge and Stop Cue on Rising edge
def start_stop_avail(gpi):
    edge = GPIO.input(gpi)
    stream = gpi_stream_dict[gpi]           # Make a copy of the dict object, for better perfomance
    print("1. {} Event detcted".format(edge))
    msg = "1. {} Event detcted".format(edge)
    socketio.emit('my_logging', {'data': msg})
    print("2. Stream is in cue: {}".format(stream.in_cue))
    
    # Rising edge detected and Stream is in Cue => Stop cue
    if edge and stream.in_cue:        
        reaction_time.start_measure()
        stream.stop_cue()
        
        reaction_time.end_measure()
        reaction_time.print_measure()
        
        #stream.in_cue = False       # Stream is no longer in cue
        gpi_stream_dict[gpi].update_info(stream)    # Update the actual object in the stream dict       
        #time.sleep(cf.wait_time)                    # Sleeps the thread for all GPIO inputs - not good
        
    # Falling edge detected and Stream is NOT in Cue => Start cue
    elif not edge and not stream.in_cue:
        reaction_time.start_measure()
        stream.start_cue()
        
        reaction_time.end_measure()
        reaction_time.print_measure()
        
        #stream.in_cue = True          # Stream is now in cue
        gpi_stream_dict[gpi].update_info(stream)    # Update the actual object in the stream dict
        #time.sleep(cf.wait_time)                    # Sleeps the thread for all GPIO inputs - not good
        

# Tie callbacks to events
for GPI in list(cf.gpi2stream):
    #GPIO.add_event_detect( GPI, GPIO.BOTH, callback = start_stop_avail, bouncetime = cf.wait_time*1000)
    GPIO.add_event_detect( GPI, GPIO.BOTH, callback = start_stop_avail, bouncetime = 200)

@app.route('/')
def index():
    return render_template('command_center.html', async_mode=socketio.async_mode)

@socketio.on('connect', namespace='')
def test_connect():
    print("Websocket connected")
    emit('my_logging', {'data': 'WebSocket Connected'})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')     