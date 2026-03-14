import serial
import time
from pynput.keyboard import Controller, Key

PORT = "COM3"
BAUD = 9600

ser = serial.Serial(PORT, BAUD, timeout=1)
time.sleep(2)

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
    elif len(line) == 1:
        keyboard.type(line)
