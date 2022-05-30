import time
import random
import json
from datetime import datetime
from pytz import timezone

from dataclasses import dataclass


@dataclass
class SensorData:
    # static
    lat: float
    long: float
    device_id: str

    # measurement
    temperature: float
    humidity: float
    pm2_5: float
    pm10: float
    timestamp: int

    @property
    def json(self) -> str:
        return json.dumps(self.__dict__)


class Sensor:
    def __init__(self, lat: float, long: float, device_id: str) -> None:
        self.__lat = lat
        self.__long = long
        self.__device_id = device_id

        env = self.__enviroment()

        # start values
        self.__temp = float(random.randint(env[0][0], env[0][1]))
        self.__humidity = float(random.randint(env[1][0], env[1][1]))
        self.__pm2_5 = float(random.randint(env[2][0], env[2][1]))
        self.__pm10 = float(random.randint(env[3][0], env[3][1]))

    def measure(self) -> SensorData:
        env = self.__enviroment()

        self.__temp = self.__random_walk(
            start=env[0][0], stop=env[0][1], decimals=1, dx=env[0][2], x=self.__temp
        )

        self.__humidity = self.__random_walk(
            start=env[1][0], stop=env[1][1], decimals=1, dx=env[1][2], x=self.__humidity
        )

        self.__pm2_5 = self.__random_walk(
            start=env[2][0], stop=env[2][1], decimals=1, dx=env[2][2], x=self.__pm2_5
        )

        self.__pm10 = self.__random_walk(
            start=env[3][0], stop=env[3][1], decimals=1, dx=env[3][2], x=self.__pm10
        )

        timestamp = int(time.time())

        return SensorData(
            lat=self.__lat,
            long=self.__long,
            device_id=self.__device_id,
            temperature=self.__temp,
            humidity=self.__humidity,
            pm2_5=self.__pm2_5,
            pm10=self.__pm10,
            timestamp=timestamp,
        )

    def __random_walk(
        self: float, start: float, stop: float, decimals: int, dx: float, x: float
    ) -> float:

        if x < start:
            value = x + random.uniform(0, dx)
        if x > stop:
            value = x + random.uniform(-dx, 0)
        else:
            value = x + random.uniform(-dx, dx)

        return round(value, decimals)

    def __enviroment(self):

        gmt = timezone("Europe/Stockholm")

        hour = datetime.now(gmt).hour

        if hour >= 22 or hour <= 5:
            return [(5, 20, 0.2), (20, 100, 1), (0, 10, 2), (0, 20, 5)]
        elif (hour >= 6 and hour <= 9) or (hour >= 19 and hour <= 21):
            return [(10, 25, 0.2), (20, 100, 1), (5, 20, 2), (10, 50, 5)]
        elif hour >= 10 and hour <= 18:
            return [(20, 35, 0.2), (20, 100, 1), (5, 20, 2), (10, 40, 5)]


if __name__ == "__main__":
    sensor = Sensor(lat=47.679006, long=9.162831, device_id="C3")

    while True:
        # print(sensor.measure())
        print(sensor.measure().json)
        time.sleep(2)
