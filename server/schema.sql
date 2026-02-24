-- PickYouUP 2.0 Database Schema
-- 請在 Supabase SQL Editor 中執行

-- 建立訂單資料表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  date DATE NOT NULL,
  time TEXT,
  flight TEXT,
  mode TEXT,
  car_type TEXT NOT NULL,
  amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  driver_id UUID,
  driver_name TEXT,
  driver_phone TEXT,
  source TEXT DEFAULT 'web',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立司機資料表
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_type TEXT DEFAULT 'small',
  license_plate TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 啟用 RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- 訂單 Policy
CREATE POLICY "訂單讀取權限" ON orders FOR SELECT USING (true);
CREATE POLICY "訂單寫入權限" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "訂單更新權限" ON orders FOR UPDATE USING (true);
CREATE POLICY "訂單刪除權限" ON orders FOR DELETE USING (true);

-- 司機 Policy
CREATE POLICY "司機讀取權限" ON drivers FOR SELECT USING (true);
CREATE POLICY "司機寫入權限" ON drivers FOR INSERT WITH CHECK (true);
CREATE POLICY "司機更新權限" ON drivers FOR UPDATE USING (true);
CREATE POLICY "司機刪除權限" ON drivers FOR DELETE USING (true);

-- 測試資料：新增一個司機
INSERT INTO drivers (name, phone, car_type, license_plate, is_active)
VALUES ('王小明', '0912345678', 'small', 'ABC-1234', true)
ON CONFLICT DO NOTHING;
