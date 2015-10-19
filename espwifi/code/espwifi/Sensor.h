#ifndef Sensor_h
#define Sensor_h

#include <OneWire.h>
#include <DallasTemperature.h>

class Sensor {
  public:   
    void init(); 
    float read();    
    
    Sensor(int pin_);

  protected:
    int pin;

  private:
    DallasTemperature *dt;
};

Sensor::Sensor(int pin_) {
  pin = pin_;
};

void Sensor::init() {
  OneWire oneWire(pin);
  dt = new DallasTemperature(&oneWire);
};

float Sensor::read() {
  dt->requestTemperatures(); 
  return dt->getTempCByIndex(0);
};

#endif

