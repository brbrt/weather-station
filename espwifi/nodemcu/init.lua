local conf = require("conf")


print("Connecting to " .. conf.wifi_ssid)

wifi.setmode(wifi.STATION)
wifi.sta.config(conf.wifi_ssid, conf.wifi_password)

tmr.alarm(1, 1000, 1, function()
  if wifi.sta.getip()== nil then
      print("Not yet connected, waiting...")
  else
    tmr.stop(1)
    print("Connected! The assigned IP address is " .. wifi.sta.getip())

    dofile('app.lua');
  end
end)
