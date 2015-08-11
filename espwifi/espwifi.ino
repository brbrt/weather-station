#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include "config.h"

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

void setup() {
  Serial.begin(115200);

  delay(10);

  initwifi();

  Serial.println("Setup finished\n");
}

void loop() {
  float temp = readtemp();
  
  sendData(temp);

  Serial.println();
  
  delay(READ_INTERVAL * 1000);
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
  } while (temp == 85.0 || temp == (-127.0));

  Serial.print("Temperature: ");
  Serial.println(temp);

  return temp;
}

void sendData(float temp) {
  Serial.println(String("Connecting to ") + TARGET_HOST + ":" + TARGET_PORT);
  
  WiFiClient client;
  if (!client.connect(TARGET_HOST, TARGET_PORT)) {
    Serial.println("Connection failed");
    return;
  }
  
  String url = "/weather?temp=" + String(temp);
  Serial.print("Requesting URL: ");
  Serial.println(url);

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

