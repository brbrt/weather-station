ADC_MODE(ADC_VCC); // To alllow input voltage reading.

#include <ESP8266WiFi.h>
#include <EEPROM.h>

#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"


#include "eeprom_anything.h"
#include "ErrorCodes.h"
#include "Sensor.h"
#include "Ds18b20Sensor.h"
#include "DhtSensor.h"
#include "config.h"

//Ds18b20Sensor sensor(ONE_WIRE_PIN);
DhtSensor sensor(ONE_WIRE_PIN);

struct SensorState
{
  float lastTemp;
  int readCount;

  String str() {
    return "lastTemp=" + String(lastTemp) + ", readCount=" +String(readCount);
  }
} sensorState;


void setup() { 
  sensor.init();
  
  sensorState.lastTemp = -15000;
  sensorState.readCount = 0;
  
  if (DEBUG_ENABLED) {
    Serial.begin(115200);
    delay(100);
  }

  EEPROM.begin(4096);
  delay(100);

  debug("Setup finished\n");
}

void loop() {
  unsigned long start = millis();

  loadSensorStateIfNeeded();

  debug("Starting sensor state: " + sensorState.str());

  sensorState.readCount++;

  float inputVoltage = ESP.getVcc();
  debug("Input voltage is: " + String(inputVoltage) + " mV");

  if (inputVoltage < INPUT_VOLTAGE_LOW_LIMIT) {
    debug("Input voltage is under limit.");
    
    sendData(INPUT_VOLTAGE_UNDER_LIMIT, INPUT_VOLTAGE_UNDER_LIMIT, inputVoltage);

    debug("Putting system into deep sleep mode to save battery.");

    deepSleep(1000000000);
  }

  Reading* r = sensor.readValid(5);
  debug("Measurement: " + r->str());
  float temp = r->temperature;

  if (abs(temp - sensorState.lastTemp) > VALUE_CHANGE_TOLERANCE || sensorState.readCount == KEEPALIVE_ON_EVERY_X_READS) {
    sensorState.lastTemp = temp;
    sensorState.readCount = 0;
    sendData(temp, r->humidity, inputVoltage);
  } else {
    debug("Not sending data now.");
  }

  delete r;

  debug("Sensor state: " + sensorState.str());

  saveSensorStateIfNeeded();

  unsigned long elapsed = millis() - start;
  debug("This loop took " + String(elapsed) + " millis.\n");
  
  sleep(READ_INTERVAL * 1000 - elapsed);
}

void initWifiIfNeeded() {
  if (WiFi.status() == WL_CONNECTED) {
    debug("Already connected to WiFi");
    return;
  }
  
  WiFi.mode(WIFI_STA);
  
  debug("\n\nConnecting to " + String(WIFI_SSID));
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    debug(".");
  }

  debug("\nWiFi connected. IP address: " + WiFi.localIP());  
}
 
void sendData(float temperature, float humidity, float inputVoltage) {
  initWifiIfNeeded();
  
  debug(String("Connecting to ") + TARGET_HOST + ":" + TARGET_PORT);
  
  WiFiClient client;
  if (!client.connect(TARGET_HOST, TARGET_PORT)) {
    debug("Connection failed");
    return;
  }
  
  String url = "/api/weather?sensor=" + String(SENSOR_ID) + 
               "&inputVoltage=" + inputVoltage +
               "&temp=" + formatNumber(temperature, VALUE_DECIMAL_PLACES);

  if (humidity != HUMIDITY_NOT_SUPPORTED) {
    url += "&humidity=" + formatNumber(humidity, VALUE_DECIMAL_PLACES);
  }
               
  debug("Request: " + url);

  client.print(String("POST ") + url + " HTTP/1.1\r\n" +
               "Host: " + TARGET_HOST + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(10);
  
  while (client.available()) {
    String line = client.readStringUntil('\r');
    debug(line);
  }
  
  debug("");
}

String formatNumber(float number, int decimalPlaces) {
  char charTemp[10];
  dtostrf(number, 1, decimalPlaces, charTemp);
  return String(charTemp);
}

void debug(String message) {
  if (DEBUG_ENABLED) {
    Serial.println(message);
    delay(10);
  }
}

void loadSensorStateIfNeeded() {
  if (USE_DEEP_SLEEP) {
    debug("Loading sensorState from EEPROM.");
    eepromReadAnything(0, sensorState);
  }
}

void saveSensorStateIfNeeded() {
  if (USE_DEEP_SLEEP) {
    debug("Saving sensorState to EEPROM.");
    eepromWriteAnything(0, sensorState);
  }
}

void sleep(int millis) {
  debug("Going into sleep for " + String(millis) + " milliseconds.");
  
  if (USE_DEEP_SLEEP) {
    debug("With deep sleep.");
    deepSleep(millis);
  } else {
    debug("With delay.");
    delay(millis);
  }
}

void deepSleep(long millis) {
  ESP.deepSleep(millis * 1000, WAKE_RF_DISABLED);
  delay(1000);
}

