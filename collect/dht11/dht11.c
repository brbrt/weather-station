//
// dht11.c
//
#include <wiringPi.h>

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#define MAXTIMINGS	85

struct Reading {
	int tempInt, tempDec;
	int humInt, humDec;
};

int pinNumber = 15;  // Default GPIO port to read data.

int read_dht11_dat(struct Reading* result) {
	int dht11_dat[5] = { 0, 0, 0, 0, 0 };
	uint8_t laststate	= HIGH;
	uint8_t counter		= 0;
	uint8_t j		= 0, i;

	// Pull pin down for 18 milliseconds.
	pinMode(pinNumber, OUTPUT);
	digitalWrite(pinNumber, LOW);
	delay(18);
	
	// Then pull it up for 40 microseconds.
	digitalWrite(pinNumber, HIGH);
	delayMicroseconds(40);
	
	// Prepare to read the pin.
	pinMode(pinNumber, INPUT);

	// Detect change and read data.
	for (i = 0; i < MAXTIMINGS; i++) {
		counter = 0;
		while (digitalRead( pinNumber ) == laststate) {
			counter++;
			delayMicroseconds(1);
			if (counter == 255) {
				break;
			}
		}		
		laststate = digitalRead(pinNumber);

		if (counter == 255) {
			break;
		}

		// Ignore first 3 transitions.
		if ((i >= 4) && (i % 2 == 0)) {
			// Shove each bit into the storage bytes.
			dht11_dat[j / 8] <<= 1;
			if (counter > 16) {
				dht11_dat[j / 8] |= 1;
			}
			
			j++;
		}
	}

	// Check we read 40 bits (8bit x 5 ) + verify checksum in the last byte.
	if ((j >= 40) && checkCRC(dht11_dat)) {
		struct Reading r;		
		r.humInt = dht11_dat[0];
		r.humDec = dht11_dat[1];
		r.tempInt = dht11_dat[2];
		r.tempDec = dht11_dat[3];
		
		*result = r;
			
		return 0;
	} else {
		printf("Data not good, skip\n");
		return 1;
	}
}

int checkCRC(int* dht11_dat) {
	return dht11_dat[4] == ( (dht11_dat[0] + dht11_dat[1] + dht11_dat[2] + dht11_dat[3]) & 0xFF);
}
 
int main(int argc, char *argv[]) {
	printf("DHT11 reading started.\n");

	// Try to get the GPIO port number from the first command line argument.
	if (argc > 1) {
	    char* port = argv[1];
        char* tmp;  
	    int parsedPort = strtol(port, &tmp, 10);
		
		if (*tmp || parsedPort < 0 || parsedPort > 30) {
		    printf("Invalid port passed in argument, using default. \n");
		} else {
		    pinNumber = parsedPort;
		}
	}

	
    if (wiringPiSetup() == -1) {
        printf("Setup wiringPi failed!");
        return 1;
    }

	while (1) {
		struct Reading r;

		if (read_dht11_dat(&r) == 0) {		
			char output[100];			
			sprintf(output, "{'hum': %d.%d, 'temp': %d.%d}\n", r.humInt, r.humDec, r.tempInt, r.tempDec); 
			
			printf(output);
			
			// Stop on the first valid reading.
			break;
		}
		
		delay(1000);
	}

	return 0;
}