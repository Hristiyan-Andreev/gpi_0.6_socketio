import time
from threading import Timer, Thread
import logging
import threading as th
import liveapi
import config as cf
import queue as qu

logging.basicConfig(level=logging.DEBUG, \
                    format='(%(threadName)-9s) %(message)s',)

# Time measurement class
class TimeMeasure():
    start_time = 0
    end_time = 0

    def __init__(self):
        self.start_time = time.time()
        self.end_time = time.time()

    def start_measure(self):
        self.start_time = time.time()

    def end_measure(self):
        self.end_time = time.time() - self.start_time

    def print_measure(self, msg = "Time measured: "):
        print(msg + str(self.end_time))


# GPI to Stream class with more information
class GpiStream:
    num = 0
    gpi = 0
    stream_id = '0'
    in_cue = False
    channel_locked = False
    
    def __init__(self, num, id, gpi):
        self.num = num
        self.gpi = gpi
        self.stream_id = id
        self.in_cue = False
        self.channel_locked = False
        
    def __str__(self):
        return "num: {} gpi: {} str_id: {} in_cue: {}" \
        .format(self.num, self.gpi, self.stream_id, self.in_cue)
        
    def update_info(self, stream):
        self.in_cue = stream.in_cue
        
    def start_cue(self, elemental_ip = cf.elemental_ip):
        if self.channel_locked is not True:
            print("3. Starting cue")
            response = liveapi.cue_command(elemental_ip, self.stream_id, 'start_cue')
            self.in_cue = True
            self.lock_channel(cf.lock_interval)
            return response
        else:
            return "Channel is locked"
        
    def stop_cue(self, elemental_ip = cf.elemental_ip):
        if self.channel_locked is not True:
            print("3. Stopping cue")
            response = liveapi.cue_command(elemental_ip, self.stream_id, 'stop_cue')
            self.in_cue = False
            return response
        else:
            return "Channel is locked"

    def lock_channel(self, lock_interval):
        self.channel_locked = True
        # Create a timer thread which triggers the unlock_channel function after
        # the expiration of 'lock_interval' seconds
        unlock_timer = Timer(lock_interval, self.unlock_channnel)
        unlock_timer.start()

    def unlock_channnel(self):
        self.channel_locked = False


class Logger(Thread):
    def __init__(self, socketio):
        Thread.__init__(self)
        self.messages = qu.Queue(10)
        self.socket = socketio
        self.new_message = th.Event()
        self.setDaemon(True)
        self.start()

    def log_message(self, message):
        if not self.messages.full():
            self.messages.put(message)
        logging.debug('Message added, notifying logger')
        # Notify and wake up the logger function that new message is added
        self.new_message.set()

    def emit_message(self):
            msg = self.messages.get()
            self.socket.emit('my_logging', {'data': msg})

    def logger(self):
        logging.debug('Logger started')
        while not self.new_message.is_set():
            logging.debug('Started waiting for message')
            # Wait until new message is available
            new_message_recieved = self.new_message.wait()

            logging.debug('New messages available')
            # After is awake - emit messages till messages queue is empty
            while not self.messages.empty():
                self.emit_message()
            
            logging.debug('Clearing the new_message flag')
            self.new_message.clear()
        
    def run(self):
        self.logger()

        