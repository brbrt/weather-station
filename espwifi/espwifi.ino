#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include "config.h"

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

float lastTemp = -15000;
int readCount = 0;

void setup() {
  Serial.begin(115200);

  delay(10);

  initwifi();

  Serial.println("Setup finished\n");
}

void loop() {
  unsigned long start = millis();
  
  float temp = readtemp();
  readCount++;

  Serial.println("Temperature: " + String(temp) + ", readCount:" + String(readCount));

  if (temp != lastTemp || readCount == KEEPALIVE_ON_EVERY_X_READS) {
    lastTemp = temp;
    readCount = 0;
    sendData(temp);
  } else {
    Serial.println("Not sending data now.");
  }

  unsigned long elapsed = millis() - start;
  Serial.println("This loop took " + String(elapsed) + " millis.\n");
  
  delay(READ_INTERVAL * 1000 - elapsed);
}

void initwifi() {
  Serial.print("\n\nConnecting to ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("\nWiFi connected. ");  
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

float readtemp() {
  float temp;
  
  do {
    DS18B20.requestTemperatures(); 
    temp = DS18B20.getTempCByIndex(0);

    Serial.print("Raw temperature: " + String(temp) + "  ");
  } while (temp == 85.0 || temp == (-127.0));

  return roundNumber(temp, VALUE_PRECISION);
}

void sendData(float temp) {
  Serial.println(String("Connecting to ") + TARGET_HOST + ":" + TARGET_PORT);
  
  WiFiClient client;
  if (!client.connect(TARGET_HOST, TARGET_PORT)) {
    Serial.println("Connection failed");
    return;
  }
  
  String url = "/weather?temp=" + formatNumber(temp, VALUE_PRECISION);
  Serial.println("Requesting URL: " + url);

  client.print(String("POST ") + url + " HTTP/1.1\r\n" +
               "Host: " + TARGET_HOST + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(10);
  
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println();
}

float roundNumber(float number, int decimalPlaces) {
  float x = pow(10, decimalPlaces);
  return roundf(number * x) / x;
}

String formatNumber(float number, int decimalPlaces) {
  char charTemp[10];
  dtostrf(number, 1, decimalPlaces, charTemp);
  return String(charTemp);
}

