CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION prefix_uuid(prefix text) RETURNS text AS $$
BEGIN
    RETURN concat(prefix, gen_random_uuid());
END;
$$ LANGUAGE PLPGSQL VOLATILE;