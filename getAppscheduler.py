from apscheduler.schedulers.blocking import BlockingScheduler
import time

x = 0

ph = 0

def some_job():
    print(ph)
    


while True:
    print("WTF")

    ph = 25
    if x == 5:
        some_job()
        x = 0
    time.sleep(1)
    x = x + 1



    
