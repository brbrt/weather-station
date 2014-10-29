DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    location_id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(256) NOT NULL,
    description VARCHAR(2048),
    order_val INT,

    CONSTRAINT locations_pk PRIMARY KEY (location_id)
);


