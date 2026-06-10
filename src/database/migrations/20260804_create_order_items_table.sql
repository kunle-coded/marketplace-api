\c marketplaceapi

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    -- Links to the catalog product
    -- ON DELETE SET NULL ensures that if a seller deletes a product from the site entirely,
    -- the customer's historical order receipt data isn't accidentally deleted from the database!
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,

    -- CRITICAL SNAPSHOT FIELDS:
    -- Even if the product name or price changes tomorrow, this receipt line stays locked forever.
    historical_name VARCHAR(255) NOT NULL,
    price_at_purchase NUMERIC(12, 2) NOT NULL CHECK (price_at_purchase >= 0),

    -- Metrics
    quantity INT NOT NULL CHECK (quantity > 0),

    -- Tracks which warehouse location this exact item line is allocated from
    warehouse_location VARCHAR(255) NOT NULL
);

-- Performance Indexes for Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);