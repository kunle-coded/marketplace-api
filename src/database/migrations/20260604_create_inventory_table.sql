\c marketplaceapi

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity_on_hand INT DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_allocated INT DEFAULT 0 CHECK (quantity_allocated >= 0 AND quantity_allocated <= quantity_on_hand),
    warehouse_location VARCHAR(255) NOT NULL,

    CONSTRAINT unique_product_per_warehouse UNIQUE (product_id, warehouse_location)
);

CREATE INDEX IF NOT EXISTS idx_inventory_products_id ON inventory(product_id);