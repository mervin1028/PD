import datetime
import pyrebase
import statistics
import serial 
import time
from firebase import firebase

arduino = serial.Serial('COM10', 9600, timeout=.1)

firebaseDb = firebase.FirebaseApplication('https://hvccare-5b4bc.firebaseio.com/')
now = datetime.datetime.today()
date = ""+str(now.month)+"-"+str(now.day)+"-"+str(now.year)+" "+str(now.hour)+":"+str(now.minute)+":"+str(now.second)


config = {
    "apiKey" : "AIzaSyCfOVS4fKzugZEv2o26Ir8rjkH2XwayfJo",
    "authDomain" : "hvccare-5b4bc.firebaseapp.com",
    "databaseURL" : "https://hvccare-5b4bc.firebaseio.com",
    "projectId" : "hvccare-5b4bc",
    "storageBucket": "hvccare-5b4bc.appspot.com",
    "messagingSenderId": "706149028538"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

crops_temp = []
crops_phlevel = []



results = db.child("Crop_Data").child("Crop_Name").get()
print(results)
for result in results.each():
    results = db.child("Standard_Parameters").child(result.val()).get()
    for value in results.each():
        if value.key() == "Average_Temp_C":
            temperature = value.val()
            crops_temp.append(temperature)
        if value.key() == "Average_PHLevel":
            phlevel = value.val()
            crops_phlevel.append(phlevel)

#print(crops_temp)
#print(crops_phlevel)

print(statistics.median(map(float,crops_temp)))
print(statistics.median(map(float,crops_phlevel)))

median_temp = statistics.median(map(float,crops_temp))
median_phlevel = statistics.median(map(float,crops_phlevel))

db.child("Sensor_Data").update({"Optimal_PhLevel": str(median_phlevel) })
db.child("Sensor_Data").update({"Optimal_Temperature": str(median_temp) })
    
tempSensor = 0.0
phSensor = 0.0
humiditySensor = 0.0

every = 0
def set_database():
    val = firebaseDb.put('Realtime_Data',date,{'Date':date,'Measured_Temp_C':str(tempSensor),'Measured_Humidity':str(humiditySensor),'Measured_PHLevel':str(phSensor)})
    

while True:
    data = arduino.readline().decode().strip()

    splitData = data.split()
   

    if splitData:
        tempSensor = float(splitData[0])
        phSensor = float(splitData[1])
        humiditySensor = float(splitData[2])
        

    print(tempSensor)
    print(phSensor)
    print(humiditySensor)
    
    if every == 1800:
        set_database()
        every = 0
    every = every + 1
    
    db.child("Sensor_Data").update({"Measured_PhLevel": str(phSensor) })
    db.child("Sensor_Data").update({"Measured_Temperature": str(tempSensor) })

    
    print(median_temp-0.5)
    if  tempSensor <= (median_temp-0.5):
        #TurnOff Peltier
        arduino.write('A'.encode())
    elif tempSensor >= (median_temp+1):
        #TurnOn Peltier
        arduino.write('B'.encode())
    elif phSensor <= (median_phlevel-0.5):
        #PhUp TurnedOn
        arduino.write('C'.encode())
    elif phSensor >= (median_phlevel+5):
        #PhDown TurnedOn
        arduino.write('D'.encode())

   



