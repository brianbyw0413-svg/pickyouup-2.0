-- ═══════════════════════════════════════════════════
-- PickYouUP orders 表欄位升級 (方案B)
-- 在 Supabase SQL Editor 執行
-- ═══════════════════════════════════════════════════

-- Step 1: 重新命名現有欄位
ALTER TABLE orders RENAME COLUMN "name" TO contact_name;
ALTER TABLE orders RENAME COLUMN "phone" TO contact_phone;
ALTER TABLE orders RENAME COLUMN "date" TO service_date;
ALTER TABLE orders RENAME COLUMN "time" TO pickup_time;
ALTER TABLE orders RENAME COLUMN "flight" TO flight_number;
ALTER TABLE orders RENAME COLUMN "mode" TO service_mode;
ALTER TABLE orders RENAME COLUMN "address" TO pickup_address;

-- Step 2: 新增欄位
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_ref TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dropoff_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
