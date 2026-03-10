# 購物網站

這是一個功能完整的電子商務購物網站，包含 8 個商品品項和 4 個分類。

## 功能特色

### 前台功能
- 首頁展示分類和精選商品
- 商品列表頁（支援分類篩選）
- 商品詳情頁
- 購物車管理
- 結帳流程

### 後台功能
- 訂單管理系統
- 訂單狀態更新（待處理、處理中、已出貨、已送達、已取消）
- 客戶資訊查看

## 技術棧

- **前端框架**: React 18 + TypeScript
- **建構工具**: Vite
- **路由**: React Router v6
- **資料庫**: Supabase
- **樣式**: 原生 CSS

## 開始使用

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env` 並填入您的 Supabase 憑證：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. 設定資料庫

在 Supabase 中執行以下 SQL 來建立所需的資料表：

參考 `supabase/migrations/` 資料夾中的遷移檔案。

### 4. 啟動開發伺服器

```bash
npm run dev
```

### 5. 建構生產版本

```bash
npm run build
```

## 資料庫結構

### Categories（分類）
- id
- name
- description
- image_url
- created_at

### Products（商品）
- id
- name
- description
- price
- stock
- category_id
- image_url
- is_active
- created_at
- updated_at

### Orders（訂單）
- id
- customer_name
- customer_email
- customer_phone
- shipping_address
- total_amount
- status
- notes
- created_at
- updated_at

### Order Items（訂單項目）
- id
- order_id
- product_id
- product_name
- quantity
- unit_price
- subtotal
- created_at

## 部署

本網站可部署到以下平台：

- Vercel
- Netlify
- Cloudflare Pages

詳細的自定義域名設定請參考 `DOMAIN_SETUP.md`。

## 授權

MIT
