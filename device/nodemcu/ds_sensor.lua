local ds18b20 = require('ds18b20')


local S = {}

function S.setup(pin)
    ds18b20.setup(pin)
end

function S.read()
    return ds18b20.read()
end

return S
