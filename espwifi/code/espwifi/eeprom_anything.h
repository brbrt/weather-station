#include <EEPROM.h>
#include <Arduino.h>  // for type definitions

// From http://playground.arduino.cc/Code/EEPROMWriteAnything

template <class T> int eepromWriteAnything(int ee, const T& value)
{
    const byte* p = (const byte*)(const void*)&value;
    unsigned int i;
    for (i = 0; i < sizeof(value); i++) {
          EEPROM.write(ee++, *p++);
    }
    EEPROM.commit();
    return i;
}

template <class T> int eepromReadAnything(int ee, T& value)
{
    byte* p = (byte*)(void*)&value;
    unsigned int i;
    for (i = 0; i < sizeof(value); i++) {
          *p++ = EEPROM.read(ee++);
    }
    return i;
}
