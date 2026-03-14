import serial
import time
import threading
import queue
import win32com.client
import pythoncom
from pynput.keyboard import Controller, Key

def tts_worker(tts_queue):
    try:
        pythoncom.CoInitialize()
        speaker = win32com.client.Dispatch("SAPI.SpVoice")
        speaker.Rate = 4
        print("TTS Engine initialized and ready.")
        while True:
            text = tts_queue.get()
            if text is None:
                break
            speaker.Speak(text)
            tts_queue.task_done()
    except Exception as e:
        print(f"TTS Error: {e}")

tts_q = queue.Queue()
tts_thread = threading.Thread(target=tts_worker, args=(tts_q,), daemon=True)
tts_thread.start()

import serial.tools.list_ports

def get_first_com_port():
    ports = serial.tools.list_ports.comports()
    if not ports:
        print("No COM ports found. Please ensure your device is plugged in.")
        exit(1)
    return ports[0].device

PORT = get_first_com_port()
print(f"Connecting to {PORT}...")
BAUD = 9600

try:
    ser = serial.Serial(PORT, BAUD, timeout=1)
    time.sleep(2)
except serial.SerialException as e:
    print(f"Failed to connect to {PORT}: {e}")
    exit(1)

keyboard = Controller()

print("Listening...")

while True:
    raw = ser.readline()

    if not raw:
        continue

    line = raw.decode("utf-8").replace("\r","").replace("\n","")

    if line == "":
        continue

    print("Received:", repr(line))

    if line == " ":
        keyboard.press(Key.space)
        keyboard.release(Key.space)
        tts_q.put("Space")
    elif line == "Backspace" or line == "\x08":
        keyboard.press(Key.backspace)
        keyboard.release(Key.backspace)
        tts_q.put("Backspace")
    elif len(line) == 1 and line.isprintable():
        keyboard.type(line)
        tts_q.put(line.upper())
    else:
        pass

