import datetime
from firebase import firebase

firebase = firebase.FirebaseApplication('https://hvccare-5b4bc.firebaseio.com/')

now = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")

print(now)
#date = ""+str(now.year)+"-"+str(now.month)+"-"+str(now.day)+" "+str(now.hour)+":"+str(now.minute)+":"+str(now.second)

result = firebase.put('Realtime_Data',now,{'Date':now,'Measured_Temp_C':21,'Measured_Humidity':82,'Measured_PHLevel': 6.5})

print(result)
