DROP TABLE basic_info;
CREATE TABLE basic_info (
	id	SERIAL PRIMARY KEY,
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	DOB DATE,
	last_updated TIMESTAMP
);


CREATE OR REPLACE FUNCTION basic_info_log() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'UPDATE') THEN
			IF (OLD.* IS DISTINCT FROM NEW.*) THEN
            	UPDATE basic_info SET last_updated = now();
			END IF;
		ELSIF (TG_OP = 'INSERT') THEN
			UPDATE basic_info SET last_updated = now();
		END IF;
        RETURN NULL;
    END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER basic_info_audit
    AFTER INSERT OR UPDATE ON basic_info
    FOR EACH ROW EXECUTE PROCEDURE basic_info_log();