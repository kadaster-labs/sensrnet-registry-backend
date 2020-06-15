import requests
import random
from time import sleep

url = 'http://localhost:3000/Sensor'
num_sensors = 163
timeout = 0.25

bbox_nl = (3.31497114423, 50.803721015, 7.09205325687, 53.5104033474)


def random_coordinate():
    lat = random.uniform(bbox_nl[1], bbox_nl[3])
    long = random.uniform(bbox_nl[0], bbox_nl[2])

    return lat, long

def register_sensor():
    lat, long = random_coordinate()
    myobj = {
        "location": {
            "latitude": lat,
            "longitude": long,
            "height": 0,
            "baseObjectId": "1"
        },
        "dataStreams": [],
        "typeName": "string",
        "active": True
    }

    x = requests.post(url, json=myobj)
    print(x.text)

def main():
    for i in range(num_sensors):
        print("Register sensor " + str(i))
        
        register_sensor()

        sleep(timeout)

if __name__ == "__main__":
    main()
