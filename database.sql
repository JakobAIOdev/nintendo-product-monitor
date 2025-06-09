CREATE TABLE monitor_products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(250),
  product_price VARCHAR(50),
  product_path VARCHAR(500),
  product_img VARCHAR(500),
  is_instock BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP DEFAULT NOW()
)

DROP TABLE monitor_products CASCADE;