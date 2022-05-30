from operator import imod
import time
import random
import json

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

        # start values
        self.__temp = 20
        self.__humidity = 40
        self.__pm2_5 = 15
        self.__pm10 = 20

    def measure(self) -> SensorData:
        self.__temp = self.__random_walk(
            start=10, stop=35, decimals=1, dx=0.2, x=self.__temp
        )

        self.__humidity = self.__random_walk(
            start=10, stop=35, decimals=1, dx=0.2, x=self.__humidity
        )

        self.__pm2_5 = self.__random_walk(
            start=10, stop=25, decimals=1, dx=0.1, x=self.__pm2_5
        )

        self.__pm10 = self.__random_walk(
            start=5, stop=50, decimals=1, dx=0.2, x=self.__pm10
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


if __name__ == "__main__":
    sensor = Sensor(lat=47.679006, long=9.162831, device_id="C3")

    while True:
        # print(sensor.measure())
        print(sensor.measure().json)
        time.sleep(2)
