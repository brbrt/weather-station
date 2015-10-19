#ifndef Sensor_h
#define Sensor_h

class Sensor {
  public:   
    virtual void init() {
    }
    
    virtual float read() {
      return -11111111;    
    }
    
    Sensor(int pin_) {
      pin = pin_;
    }

  protected:
    int pin;
};

#endif

