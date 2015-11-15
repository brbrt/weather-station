local conf = require("conf")
local network = require("network")


print("Start measurement")

input_voltage = adc.readvdd33()
print("Input voltage is " .. input_voltage)

network.upload_measurement(input_voltage, 899);

