DROP TABLE IF EXISTS historic_values;

CREATE TABLE historic_values (
    sensor_id INT NOT NULL,
    measure_day DATE NOT NULL,
    temp_values TEXT NOT NULL,
    hum_values TEXT,

    CONSTRAINT actual_values_pk PRIMARY KEY (sensor_id, measure_day)
)
;


ALTER TABLE historic_values
ADD CONSTRAINT historic_values_sensors_fk
FOREIGN KEY actual_values_sensors_fk (sensor_id) REFERENCES sensors (sensor_id);
