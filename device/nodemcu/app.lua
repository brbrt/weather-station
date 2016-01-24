local sensor = require("ds_sensor")

local conf = require("conf")
local network = require("network")


print("Start measurement")

input_voltage = adc.readvdd33()
print("Input voltage is " .. input_voltage)
    
sensor.setup(conf.pin)

local temp = sensor.read()
print("Current temperature is " .. temp .. " C\n")    

network.upload_measurement(input_voltage, temp);
