local conf = require("conf")

local N = {}

local function connect(task)
    print("Connecting to " .. conf.wifi_ssid)

    wifi.setmode(wifi.STATION)
    wifi.sta.config(conf.wifi_ssid, conf.wifi_password)

    tmr.alarm(1, 1000, 1, function()
      if wifi.sta.getip()== nil then
          print("Not yet connected, waiting...")
      else
        tmr.stop(1)
        print("Connected! The assigned IP address is " .. wifi.sta.getip())

        task()
      end
    end)
end


local function disconnect()
    print("Disconnecting from wifi")
    wifi.sta.disconnect()
end


local function upload(input_voltage, temp, task)
    local conn=net.createConnection(net.TCP, 0)
    conn:on("receive", task)
    conn:connect(conf.target_port, conf.target_host)

    local url =
        "/api/weather?sensor=" .. conf.sensor_id ..
        "&inputVoltage=" .. input_voltage ..
        "&temp=" .. temp

    local http_query =
        "POST " .. url .. " HTTP/1.1\r\n" ..
        "Host: " .. conf.target_host .. ":" .. conf.target_port .. " \r\n" ..
        "Connection: close\r\n\r\n";

    print("HTTP query: \n" .. http_query)

    conn:send(http_query)
end


function N.upload_measurement(input_voltage, temp)
    connect(function()
        upload(input_voltage, temp, function(conn, resp)
            print("Server response: \n" .. resp)
            disconnect()
        end)
    end)
end


return N
