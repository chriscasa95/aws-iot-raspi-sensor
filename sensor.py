from time import sleep
from gpiozero import CPUTemperature
from time import sleep

while True:
    cpu = CPUTemperature()
    print(cpu.temperature)

    sleep(1)
