-- db/init.sql — jalan sekali saat volume Postgres masih kosong
CREATE DATABASE catalog_db;  -- milik catalog-service
CREATE DATABASE order_db;    -- milik order-service
CREATE DATABASE payment_db;  -- milik payment-service