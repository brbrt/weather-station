//
// dht11.c
//
#include <wiringPi.h>

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#define MAXTIMINGS	85

#define MAX_RETRIES	10

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
	if ((j >= 40) && check_crc(dht11_dat)) {
		struct Reading r;		
		r.humInt = dht11_dat[0];
		r.humDec = dht11_dat[1];
		r.tempInt = dht11_dat[2];
		r.tempDec = dht11_dat[3];
		
		*result = r;
			
		return 0;
	} else {
		fprintf(stderr, "Skipping invalid data\n");
		return 1;
	}
}

int check_crc(int* dht11_dat) {
	return dht11_dat[4] == ( (dht11_dat[0] + dht11_dat[1] + dht11_dat[2] + dht11_dat[3]) & 0xFF);
}
 
int main(int argc, char *argv[]) {
	// Try to get the GPIO port number from the first command line argument.
	if (argc > 1) {
	    char* port = argv[1];
        char* tmp;  
	    int parsedPort = strtol(port, &tmp, 10);
		
		if (*tmp || parsedPort < 0 || parsedPort > 30) {
		    fprintf(stderr, "Invalid port '%s' passed in argument, using the default '%d'. \n", port, pinNumber);
		} else {
		    pinNumber = parsedPort;
		}
	}

	
    if (wiringPiSetup() == -1) {
        fprintf(stderr, "Setup wiringPi failed!");
        return 1;
    }

	int i;
	for (i = 0; i < MAX_RETRIES; i++) {
		struct Reading r;

		if (read_dht11_dat(&r) == 0) {		
			char output[100];			
			sprintf(output, "{'hum': %d.%d, 'temp': %d.%d}\n", r.humInt, r.humDec, r.tempInt, r.tempDec); 
			
			printf(output);
			
			// Stop on the first valid reading.
			return 0;
		}
		
		delay(1000);
	}

	fprintf(stderr, "Couldn't read valid data in %d retries, exiting.", MAX_RETRIES);
	
	return 2;
}