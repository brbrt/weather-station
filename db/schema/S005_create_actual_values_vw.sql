CREATE OR REPLACE VIEW actual_values_vw AS
SELECT av.measure_date,
       av.temp_value,
       av.hum_value,
       l.code as location_code,
       l.description as location_desc,
       l.order_val as location_order,
       s.priority as sensor_priority
  FROM actual_values av
       JOIN sensors s ON av.sensor_id = s.sensor_id
	   JOIN locations l ON s.location_id = l.location_id;



