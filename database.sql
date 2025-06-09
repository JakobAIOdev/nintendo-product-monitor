CREATE DATABASE nintendomonitor;

DROP TABLE IF EXISTS monitor_products CASCADE;

CREATE TABLE monitor_products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(250) NOT NULL,
  product_price VARCHAR(50),
  product_path VARCHAR(500),
  product_img VARCHAR(500),
  is_instock BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_monitor_products_instock ON monitor_products(is_instock);