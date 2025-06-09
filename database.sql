-- Table for all products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(250),
  product_url VARCHAR(500),
  is_instock BOOLEAN DEFAULT FALSE,
  last_checked TIMESTAMP
);

-- Table for monitoring-set
CREATE TABLE monitoring_products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id)
);
