#ifndef Sensor_h
#define Sensor_h

struct Reading {
  float temperature;
};

class Sensor {
  public:   
    virtual void init() {
    }
    
    virtual Reading* read() {
      Reading *r = new Reading();
      r->temperature = -11111111;
      return r;    
    }
    
    Sensor(int pin_) {
      pin = pin_;
    }

  protected:
    int pin;
};

#endif

