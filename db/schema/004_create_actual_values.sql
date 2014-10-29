DROP TABLE IF EXISTS actual_values;

CREATE TABLE actual_values (
    sensor_id INT NOT NULL ,
    measure_date DATE NOT NULL ,
    temp_value NUMERIC(5,1) NOT NULL ,
	hum_value NUMERIC(5,1),
    CONSTRAINT actual_values_pk PRIMARY KEY (sensor_id)
) ENGINE MEMORY
;


ALTER TABLE actual_values 
ADD CONSTRAINT actual_values_sensors 
FOREIGN KEY actual_values_sensors (sensor_id) REFERENCES sensors (sensor_id);


