/*
  # 插入示範資料

  插入 4 個分類和 8 個商品的示範資料
  所有圖片使用 Pexels 免費圖庫
*/

-- 插入分類
INSERT INTO categories (name, description, image_url) VALUES
  ('電子產品', '智能手機、電腦、平板等電子產品', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('服裝配件', '時尚服裝與配件', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('家居生活', '家居裝飾與生活用品', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('運動健身', '運動裝備與健身用品', 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT DO NOTHING;

-- 獲取分類 ID
DO $$
DECLARE
  cat_electronics uuid;
  cat_fashion uuid;
  cat_home uuid;
  cat_sports uuid;
BEGIN
  SELECT id INTO cat_electronics FROM categories WHERE name = '電子產品' LIMIT 1;
  SELECT id INTO cat_fashion FROM categories WHERE name = '服裝配件' LIMIT 1;
  SELECT id INTO cat_home FROM categories WHERE name = '家居生活' LIMIT 1;
  SELECT id INTO cat_sports FROM categories WHERE name = '運動健身' LIMIT 1;

  -- 插入商品（電子產品）
  INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
    ('無線藍牙耳機', '高品質音質的無線藍牙耳機，適合音樂愛好者', 2999, 50, cat_electronics, 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=800'),
    ('智能手環', '追蹤健康與運動數據的智能手環', 1899, 30, cat_electronics, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800')
  ON CONFLICT DO NOTHING;

  -- 插入商品（服裝配件）
  INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
    ('時尚雙肩包', '質感細膻的雙肩包，適合日常使用', 1599, 40, cat_fashion, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800'),
    ('太陽眼鏡', '時尚防紫外線太陽眼鏡', 899, 60, cat_fashion, 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800')
  ON CONFLICT DO NOTHING;

  -- 插入商品（家居生活）
  INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
    ('香氛蜡燭', '獨特香氛的手工蜡燭，營造溫馨氛圍', 399, 100, cat_home, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=800'),
    ('裝飾花瓶', '精美的陶瓷花瓶，適合家居裝飾', 699, 45, cat_home, 'https://images.pexels.com/photos/1445416/pexels-photo-1445416.jpeg?auto=compress&cs=tinysrgb&w=800')
  ON CONFLICT DO NOTHING;

  -- 插入商品（運動健身）
  INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
    ('瑜伽墊', '高品質防滑瑜伽墊，適合各種運動', 899, 35, cat_sports, 'https://images.pexels.com/photos/4397841/pexels-photo-4397841.jpeg?auto=compress&cs=tinysrgb&w=800'),
    ('運動水壺', '大容量便攜水壺，運動必備', 499, 80, cat_sports, 'https://images.pexels.com/photos/2528118/pexels-photo-2528118.jpeg?auto=compress&cs=tinysrgb&w=800')
  ON CONFLICT DO NOTHING;
END $$;
