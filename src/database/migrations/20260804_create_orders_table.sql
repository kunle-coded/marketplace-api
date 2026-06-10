\c marketplaceapi


CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- The buyer (points to existing users table)
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

    -- Financial fields (Using NUMERIC to guarantee decimal accuracy)
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),

    -- Lifecycle state
    status order_status_enum NOT NULL DEFAULT 'pending',

    -- Flat shipping information text fields
    shipping_name VARCHAR(255) NOT NULL,
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(255) NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes for Orders
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order created, awaiting payment authorization
-- Payment settled, ready for warehouse fulfillment
-- Items are being picked/packed in the warehouse
-- Handed over to the logistics carrier
-- Successfully received by the customer
-- Cancelled before fulfillment
-- Returned and funds returned