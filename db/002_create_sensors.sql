DROP TABLE IF EXISTS sensors;

CREATE TABLE sensors (
    sensor_id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(256) NOT NULL,
    type VARCHAR(256) NOT NULL,
    physical_id VARCHAR(256) NOT NULL,
    description VARCHAR(2048),
    CONSTRAINT sensors_pk PRIMARY KEY (sensor_id)
);

