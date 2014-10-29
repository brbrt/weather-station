DROP TABLE IF EXISTS sensors;

CREATE TABLE sensors (
    sensor_id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(256) NOT NULL,
    physical_id VARCHAR(256) NOT NULL,
    location_id INT NOT NULL,
    priority INT NOT NULL DEFAULT 1,
    CONSTRAINT sensors_pk PRIMARY KEY (sensor_id)
);

ALTER TABLE sensors 
ADD CONSTRAINT sensors_location_fk
FOREIGN KEY sensors_location_fk (location_id) REFERENCES locations (location_id);


