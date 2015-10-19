#ifndef Ds18b20Sensor_h
#define Ds18b20Sensor_h

#include <OneWire.h>
#include <DallasTemperature.h>

#include "Sensor.h"

class Ds18b20Sensor : public Sensor {
  public:   
    void init() {
      OneWire oneWire(pin);
      dt = new DallasTemperature(&oneWire); 
    }
    
    float read() {
      dt->requestTemperatures(); 
      return dt->getTempCByIndex(0);  
    }
    
    Ds18b20Sensor(int pin_) : Sensor(pin_) {}

  private:
    DallasTemperature *dt;
  
};

#endif

