#ifndef Sensor_h
#define Sensor_h

#include "ErrorCodes.h"

struct Reading {
  float temperature;
  float humidity;

  Reading() {}

  Reading (float temperature_, float humidity_) {
    temperature = temperature_;
    humidity = humidity_;
  }

  String str() {
    return "T=" + String(temperature) + ", RH=" +String(humidity);
  }
};

class Sensor {
  public:   
    virtual void init() {
    }
    
    virtual Reading* readValid(int maxRetries) {
      int retryCount = 0;      
      
      do {   
        Reading* candidate = read();
        if (isValid(candidate)) {
          return candidate;
        }
        
        delete candidate;
        retryCount++;
        
      } while(retryCount < maxRetries);
      
      return new Reading(INVALID_MEASUREMENTS, INVALID_MEASUREMENTS);
    }
    
    virtual Reading* read() {
      Reading *r = new Reading();
      r->temperature = -11111111;
      r->humidity = -11111111;
      return r;    
    }

    virtual bool isValid(Reading* r) {
      return true;
    }
    
    Sensor(int pin_) {
      pin = pin_;
    }

  protected:
    int pin;
};

#endif

