#ifndef Ds18b20Sensor_h
#define Ds18b20Sensor_h

#include <OneWire.h>
#include <DallasTemperature.h>

#include "ErrorCodes.h"
#include "Sensor.h"

class Ds18b20Sensor : public Sensor {
  public:   
    void init() {
      OneWire oneWire(pin);
      dt = new DallasTemperature(&oneWire); 
    }
    
    Reading* read() {
      Reading *r = new Reading();      
      
      dt->requestTemperatures(); 
      
      r->temperature = dt->getTempCByIndex(0);
      r->humidity = HUMIDITY_NOT_SUPPORTED;
      
      return r;    
    }

    bool isValid(Reading* r) {
      float temp = r->temperature;
      return temp < 50.0 && temp > -50.0;
    }
    
    Ds18b20Sensor(int pin_) : Sensor(pin_) {}

  private:
    DallasTemperature *dt;
  
};

#endif

