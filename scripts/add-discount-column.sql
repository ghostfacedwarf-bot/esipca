-- Add discountPercent column to Product table (for production MySQL)
-- Run this on Hostinger MySQL database before deploying

ALTER TABLE Product
ADD COLUMN discountPercent FLOAT DEFAULT 0
AFTER priceFrom;

-- Verify the column was added
DESCRIBE Product;
