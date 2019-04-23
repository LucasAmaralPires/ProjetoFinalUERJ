import serial
import time
from Database import *
arduino = serial.Serial('COM3', 9600, timeout=0)
db = Database()
requests = {}
#requests[x] = [teacher_mode, teacher,0 or num_card,0 or mat]
#result = requests.pop(key,None)

def send_arduino(classroom, code):
    send = classroom + code
    print("Sending to Arduino")
    arduino.write(send.encode('utf-8'))

def E(classroom,room):
    if classroom[2] != 0 and classroom[3] != 0:
        db.link_card_matriculation(str(classroom[3]),str(classroom[2]))
    if classroom[2] != 0:
        send_arduino(room,db.insert_delete_student_class(room,classroom[2]))
    elif classroom[3] != 0:
        send_arduino(room,db.insert_delete_student_class(room,classroom[3]))

while 1:
    try:
        texto = arduino.readline()
        texto = texto.decode('utf-8')
        print(texto,end = '')
        if len(texto) > 10:
            classroom = texto[:4]
            if classroom in requests:
                if requests[classroom][1]:
                    if requests[classroom][4]:
                        requests[classroom][3] = texto[4:len(texto)-2]
                        E(requests[classroom],classroom)
                        result = requests.pop(classroom,None)
                    else:
                        requests[classroom][2] = texto[4:len(texto)-2]
                        if db.validate_card(texto[4:len(texto)-2]):
                            E(requests[classroom],classroom)
                            result = requests.pop(classroom,None)
                        else:
                            requests[classroom][4] = True
                            send_arduino(classroom,"7\n")
                elif requests[classroom][0]:
                    if db.validate_teacher(classroom,texto[4:len(texto)-2]):
                        send_arduino(classroom, "5\n")
                        requests[classroom][1] = True
                    else:
                        send_arduino(classroom, "6\n")
                        result = requests.pop(classroom,None)
            else:
                if db.mark_attendance(classroom,texto[4:len(texto)-2]):
                    send_arduino(classroom, "1\n")
                else:
                    send_arduino(classroom, "6\n")
        elif len(texto) > 4 and texto[4] == '!':
            classroom = texto[:4]
            if classroom not in requests:
                requests[classroom] = [True,False,0,0,False]
                send_arduino(classroom, "2\n")
            else:
                if requests[classroom][1]:
                    requests[classroom][4] = True
                    send_arduino(classroom,"7\n")
            
##            if db.validate_teacher(texto[:4],texto[4:len(texto)-2]):
##                send_arduino(texto[:4], "7\n")
##            else:
##                send_arduino(texto[:4], "8\n")
##        
##        print(db.mark_attendance(texto[:4],texto[4:len(texto)-2]))
##        if len(texto) > 10:
##            if db.validate_teacher(texto[:4],texto[4:len(texto)-2]):
##                send = texto[:4] + "3\n"
##                print("Sending to Arduino")
##                arduino.write(send.encode('utf-8'))
##            else:
##                send = texto[:4] + "8\n"
##                print("Sending to Arduino")
##                arduino.write(send.encode('utf-8'))
        time.sleep(1)
    except arduino.SerialTimeoutException:
        print('Data could not be read')
        time.sleep(1)
    
