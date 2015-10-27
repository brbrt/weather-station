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
    
    Reading* read() {
      Reading *r = new Reading();
      r->temperature = dht->readTemperature();
      r->humidity = dht->readHumidity();
      return r;    
    }

    bool isValid(Reading* r) {
      float temp = r->temperature;
      float hum = r->humidity;
      return !isnan(temp) && !isnan(hum);
    }
    
    DhtSensor(int pin_) : Sensor(pin_) {}

  private:
    int type;
    DHT *dht;
  
};

#endif

