import serial
import time
from Database import *
arduino = serial.Serial('COM3', 9600, timeout=0)
db = Database()

while 1:
    try:
        texto = arduino.readline()
        texto = texto.decode('utf-8')
        print(texto,end = '')
        if len(texto) > 10:
            if db.validate_teacher(texto[:4],texto[4:len(texto)-2]):
                send = texto[:4] + "3\n"
                print("Sending to Arduino")
                arduino.write(send.encode('utf-8'))
            else:
                send = texto[:4] + "8\n"
                print("Sending to Arduino")
                arduino.write(send.encode('utf-8'))
        time.sleep(1)
    except arduino.SerialTimeoutException:
        print('Data could not be read')
        time.sleep(1)
    
