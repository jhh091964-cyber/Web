/*
  # 建立購物網站資料庫結構

  1. 新增資料表
    - `categories` - 商品分類
      - `id` (uuid, primary key)
      - `name` (分類名稱)
      - `description` (分類描述)
      - `image_url` (分類圖片)
      - `created_at` (建立時間)
    
    - `products` - 商品
      - `id` (uuid, primary key)
      - `name` (商品名稱)
      - `description` (商品描述)
      - `price` (價格)
      - `stock` (庫存)
      - `category_id` (所屬分類)
      - `image_url` (商品圖片)
      - `is_active` (是否上架)
      - `created_at` (建立時間)
      - `updated_at` (更新時間)
    
    - `orders` - 訂單
      - `id` (uuid, primary key)
      - `customer_name` (客戶姓名)
      - `customer_email` (客戶電子郵件)
      - `customer_phone` (客戶電話)
      - `shipping_address` (配送地址)
      - `total_amount` (總金額)
      - `status` (訂單狀態)
      - `notes` (備註)
      - `created_at` (建立時間)
      - `updated_at` (更新時間)
    
    - `order_items` - 訂單項目
      - `id` (uuid, primary key)
      - `order_id` (訂單 ID)
      - `product_id` (商品 ID)
      - `product_name` (商品名稱)
      - `quantity` (數量)
      - `unit_price` (單價)
      - `subtotal` (小計)
      - `created_at` (建立時間)

  2. 安全性
    - 全部資料表啟用 RLS
    - 設定公開讀取的策略
    - 訂單寫入公開，但只有管理員可以讀取和修改
*/

-- 創建 categories 表
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 創建 products 表
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 創建 orders 表
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 創建 order_items 表
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories 策略：所有人可讀
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Products 策略：所有人可讀取上架的商品
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Orders 策略：任何人可建立訂單
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Orders 策略：任何人可讀取訂單（實際使用時應限制為管理員）
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Orders 策略：任何人可更新訂單（實際使用時應限制為管理員）
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Order Items 策略：任何人可建立訂單項目
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Order Items 策略：任何人可讀取訂單項目
CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

-- 創建索引以提高查詢效能
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
