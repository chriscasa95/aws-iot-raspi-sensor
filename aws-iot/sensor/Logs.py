from dataclasses import dataclass

from operator import imod
import time
import random
import json

from dataclasses import dataclass


@dataclass
class LogData:

    cpu_temp: float
    level: str
    message: str

    @property
    def json(self) -> str:
        return json.dumps(self.__dict__)


class Log:
    def __init__(self) -> None:
        pass
