ADC_MODE(ADC_VCC); // To alllow input voltage reading.

#include <ESP8266WiFi.h>
#include <EEPROM.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include "eeprom_anything.h"
#include "config.h"

OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature DS18B20(&oneWire);


struct SensorState
{
  float lastTemp;
  int readCount;
} sensorState;


void setup() {
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

  debug("Starting sensor state: temperature=" + String(sensorState.lastTemp) + ", readCount=" + String(sensorState.readCount));

  sensorState.readCount++;

  float inputVoltage = ESP.getVcc();
  debug("Input voltage is: " + String(inputVoltage) + " mV");
  delay(250);

  if (inputVoltage < INPUT_VOLTAGE_LOW_LIMIT) {
    debug("Input voltage is under limit.");
    
    sendData(-200, inputVoltage);

    debug("Putting system into deep sleep mode to save battery.");

    deepSleep(1000000000);
  }

  float temp = readtemp();
  debug("Sensor state: temperature=" + String(temp) + ", readCount=" + String(sensorState.readCount));

  if (abs(temp - sensorState.lastTemp) > VALUE_CHANGE_TOLERANCE || sensorState.readCount == KEEPALIVE_ON_EVERY_X_READS) {
    sensorState.lastTemp = temp;
    sensorState.readCount = 0;
    sendData(temp, inputVoltage);
  } else {
    debug("Not sending data now.");
  }

  saveSensorStateIfNeeded();

  unsigned long elapsed = millis() - start;
  debug("This loop took " + String(elapsed) + " millis.\n");
  
  sleep(READ_INTERVAL * 1000 - elapsed);
}

void initWifiIfNeeded() {
  if (WiFi.status() == WL_CONNECTED) {
    debug("Already connected to WiFi.");
    return;
  }

  resetWifiConnection();
  
  int connectionAttempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    debug("Waiting... (Current status: " + String(WiFi.status()) + ")");
    connectionAttempts++;

    if (connectionAttempts % 15 == 0) {
      debug("Maximum connection timeout is reached. Waiting and trying to reset the connection.");
      disconnectWifi();
      delay(60000);
      ESP.restart();
    }
  }

  debug("Connected to WiFi. IP address: " + WiFi.localIP());  
}

void disconnectWifi() {
  debug("Disconnecting from wireless network.");
  WiFi.disconnect();
  delay(1000);
}

void resetWifiConnection() {
  WiFi.mode(WIFI_STA);

  delay(1000);
  
  debug("\n\nConnecting to " + String(WIFI_SSID));
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

float readtemp() {
  int retryCount = 0;
  
  float temp; 
  
  do {   
    if (retryCount > 5) {
      return -100;
    }
    
    DS18B20.requestTemperatures(); 
    temp = DS18B20.getTempCByIndex(0);

    debug("Raw temperature: " + String(temp) + "  ");
    retryCount++;
  } while (!isTemperatureValid(temp));

  debug("");

  return temp;
}

bool isTemperatureValid(float temp) {
  return temp < 85.0 && temp > -127.0;
}

void sendData(float temp, float inputVoltage) {
  initWifiIfNeeded();
  
  debug(String("Connecting to ") + TARGET_HOST + ":" + TARGET_PORT);
  
  WiFiClient client;
  if (!client.connect(TARGET_HOST, TARGET_PORT)) {
    debug("Connection failed");
    return;
  }
  
  String url = "/api/weather?sensor=" + String(SENSOR_ID) + 
               "&temp=" + formatNumber(temp, VALUE_DECIMAL_PLACES) + 
               "&inputVoltage=" + inputVoltage;
               
  debug("Request: " + url);

  client.print(String("POST ") + url + " HTTP/1.1\r\n" +
               "Host: " + TARGET_HOST + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(10);
  
  while (client.available()) {
    String line = client.readStringUntil('\r');
    debug(line);
  }

  debug("Finished sending data to server.");
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
