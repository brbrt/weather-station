#ifndef DhtSensor_h
#define DhtSensor_h

#include "DHT.h"

#include "Sensor.h"

class DhtSensor : public Sensor {
  public:   
    void init() {
      dht = new DHT(pin, 21);
      dht->begin();
    }
    
    float read() {
      return dht->readTemperature();
    }
    
    DhtSensor(int pin_) : Sensor(pin_) {}

  private:
    int type;
    DHT *dht;
  
};

#endif

