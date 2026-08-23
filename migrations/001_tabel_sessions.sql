BEGIN;
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'buka',
  kapasitas INTEGER NOT NULL,
  terpakai INTEGER DEFAULT 0,
  CONSTRAINT kapasitas_tak_minus CHECK (kapasitas >= terpakai)
);
COMMIT;