#import time, Tello, & Timer packages .
#from time ,djitellopy, & codetiming.
import time
from djitellopy import Tello
from codetiming import Timer

# Variables to declare a timer, the tello drone, and distances. 
start = time.time()
t = Timer(name="time1")
t.start()
tello = Tello()
distance = 0
maxDistance = 500
observedDistance = 0
tello.connect()

#Print pretrip flight information, enabling mission pads & timer.
print(tello.get_battery())
tello.enable_mission_pads()
tello.set_mission_pad_detection_direction(0)
print("Preflight check parameters " + (str(t.stop()) + " seconds"))
t.start()

#Initial commands for take off, set movement & speed, and declaring variable for mission pad ID.
tello.takeoff()
t.stop()
#start timer.
t.start()
tello.set_speed(100)
tello.move_down(50)
t.stop()
pad = tello.get_mission_pad_id()
print("The Mission Pad Number is: " + str(pad))
time.sleep(.25)

"""While loop that cycles through observed distance, max distance, & the search for a mission pad ID.
Timers are also included for measurement."""
while observedDistance < maxDistance:
#Start time.
    t.start()
    if pad == -1:
        print("No Mission Pad Detected")
        print("Still searching")
        distance = 25
        tello.move_forward(distance)
    observedDistance = observedDistance + distance
    print("Distance traveled is " + str(observedDistance))
    pad = tello.get_mission_pad_id()
    t.stop()
    if pad == 3:
        t.start()
        print("The Mission Pad Number is: " + str(pad))
        print("Time to take a little break!")
        tello.land()
        t.stop()
        break
        
"""If/Else statement used for out of bounds detection & the final tasks
for the drone to complete before shutting down."""
if observedDistance >= 500:
    print("Range is out of bounds!")
    print("Abort mission/land now!")
else:
    end = time.time()
    print("Total distance traveled was " + str(observedDistance))
    print("Total elapsed time was " + str(end - start))
tello.end()
quit()
