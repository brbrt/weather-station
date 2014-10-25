//
// dht11.c
//
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#include <wiringPi.h>

typedef unsigned char uint8;
typedef unsigned int  uint16;
typedef unsigned long uint32;

#define HIGH_TIME 32

int pinNumber = 15;  // Default GPIO port to read data.
uint32 databuf;
 
 
uint8 readSensorData(void) {
    uint8 crc; 
    uint8 i;
 
    pinMode(pinNumber,OUTPUT); // set mode to output
    digitalWrite(pinNumber, 0); // output a high level 
    delay(25);
    digitalWrite(pinNumber, 1); // output a low level 
    pinMode(pinNumber, INPUT); // set mode to input
    pullUpDnControl(pinNumber, PUD_UP);

    delayMicroseconds(27);
    if (digitalRead(pinNumber) == 0) { //SENSOR ANS
        while (!digitalRead(pinNumber)); //wait to high

        for (i = 0; i < 32; i++) {
            while (digitalRead(pinNumber)); //data clock start
            while (!digitalRead(pinNumber)); //data start
            delayMicroseconds(HIGH_TIME);
            databuf *= 2;
			
            if (digitalRead(pinNumber) == 1) { //1
                databuf++;
            }
        }

        for (i = 0; i < 8; i++) {
            while (digitalRead(pinNumber)); //data clock start
            while (!digitalRead(pinNumber)); //data start
			
            delayMicroseconds(HIGH_TIME);
            crc *= 2;  
			
            if (digitalRead(pinNumber) == 1) { //1
                crc++;
            }
        }
		
		int humInt = (databuf >> 24) & 0xff;
		int humDec = (databuf >> 16) & 0xff;
		int tempInt = (databuf >> 8) & 0xff;
		int tempDec = databuf & 0xff;
		
		if (crc != (humInt + humDec + tempInt + tempDec) & 0xFF) {
			printf("CRC check has failed.");
			return 2;
        }
		
        return 0;
    } else {
        return 1;
    }
}
 
int main(int argc, char *argv[]) {
	// Try to get the GPIO port number from the first command line argument.
	if (argc > 1) {
        char* tmp;  
	    int parsed = strtol(argv[1], &tmp, 10);
		
		if (*tmp || parsed == LONG_MAX || parsed < 0) {
		    printf("Invalid port passed in argument, using default. \n");
		} else {
		    pinNumber = parsed;
		}
	}

    printf("Using GPIO%d to read data\n", pinNumber);

    if (wiringPiSetup() == -1) {
        printf("Setup wiringPi failed!");
        return 1;
    }
 
    pinMode(pinNumber, OUTPUT); // set mode to output
    digitalWrite(pinNumber, 1); // output a high level 

    while (1) {
        pinMode(pinNumber,OUTPUT); // set mode to output
        digitalWrite(pinNumber, 1); // output a high level 
        delay(3000);
		
        if (readSensorData() == 0) {
            printf("Sensor data read ok!\n");
			
			int humInt = (databuf >> 24) & 0xff;
			int humDec = (databuf >> 16) & 0xff;
			int tempInt = (databuf >> 8) & 0xff;
			int tempDec = databuf & 0xff;
			
			char* output;
			
			sprintf(output, "{'hum': %d.%d, 'temp': %d.%d}\n", humInt, humDec, tempInt, tempDec); 
			
			printf(output);
			
			break;
        } else {
            printf("Sorry! Couldn't read data from sensor.\n");
            databuf = 0;
        }
    }
	
    return 0;
}