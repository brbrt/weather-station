ADC_MODE(ADC_VCC); // To alllow input voltage reading.

#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include "config.h"

OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature DS18B20(&oneWire);

float lastTemp = -15000;
int readCount = 0;

void setup() {
  if (DEBUG_ENABLED) {
    Serial.begin(115200);
    delay(100);
  }

  initwifi();

  debug("Setup finished\n");
}

void loop() {
  unsigned long start = millis();
  
  float temp = readtemp();
  readCount++;

  debug("Temperature: " + String(temp) + ", readCount:" + String(readCount));
 
  float inputVoltage = ESP.getVcc();
  debug("Input voltage is: " + String(inputVoltage) + " mV");

  if (abs(temp - lastTemp) > VALUE_CHANGE_TOLERANCE || readCount == KEEPALIVE_ON_EVERY_X_READS) {
    lastTemp = temp;
    readCount = 0;
    sendData(temp, inputVoltage);
  } else {
    debug("Not sending data now.");
  }

  unsigned long elapsed = millis() - start;
  debug("This loop took " + String(elapsed) + " millis.\n");

  delay(READ_INTERVAL * 1000 - elapsed);
}

void initwifi() {
  debug("\n\nConnecting to " + String(WIFI_SSID));
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    debug(".");
  }

  debug("\nWiFi connected. IP address: " + WiFi.localIP());  
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
  }
}

