# 自定義域名設置指南

本購物網站支援使用您自己的域名。以下是不同部署平台的設置方式：

## Vercel 部署

1. **部署網站**
   - 將代碼推送到 GitHub
   - 連接 Vercel 與您的 GitHub 倉庫
   - Vercel 會自動部署網站

2. **添加自定義域名**
   - 在 Vercel 專案設定中，前往「Domains」
   - 輸入您的域名（例如：shop.yourdomain.com）
   - 按照指示在您的域名提供商處添加 DNS 記錄：
     - 類型：CNAME
     - 名稱：shop（或您想要的子域名）
     - 值：cname.vercel-dns.com

3. **SSL 憑證**
   - Vercel 會自動為您的域名提供免費 SSL 憑證

## Netlify 部署

1. **部署網站**
   - 將代碼推送到 GitHub
   - 連接 Netlify 與您的 GitHub 倉庫
   - Netlify 會自動部署網站

2. **添加自定義域名**
   - 在 Netlify 專案設定中，前往「Domain Management」
   - 點擊「Add custom domain」
   - 輸入您的域名
   - 在您的域名提供商處添加 DNS 記錄：
     - 類型：CNAME
     - 名稱：您的子域名
     - 值：您的 Netlify 網站名稱.netlify.app

3. **SSL 憑證**
   - Netlify 會自動提供免費的 Let's Encrypt SSL 憑證

## Cloudflare Pages 部署

1. **部署網站**
   - 連接 Cloudflare Pages 與您的 GitHub 倉庫
   - 構建命令：`npm run build`
   - 輸出目錄：`dist`

2. **添加自定義域名**
   - 在 Cloudflare Pages 專案中，前往「Custom Domains」
   - 如果您的域名已在 Cloudflare：
     - 直接輸入域名，DNS 記錄會自動添加
   - 如果域名不在 Cloudflare：
     - 添加 CNAME 記錄指向 Pages 提供的地址

3. **SSL 憑證**
   - Cloudflare 自動提供 SSL 憑證

## 環境變數設置

無論使用哪個平台，都需要設置以下環境變數：

- `VITE_SUPABASE_URL`：您的 Supabase 專案 URL
- `VITE_SUPABASE_ANON_KEY`：您的 Supabase 匿名金鑰

這些值可以在 Supabase 專案設定的 API 區域找到。

## DNS 記錄生效時間

DNS 記錄更新通常需要幾分鐘到 48 小時不等，具體取決於：
- 您的域名提供商
- DNS 的 TTL（Time To Live）設置
- 全球 DNS 伺服器的更新速度

建議在更新 DNS 後等待約 1-2 小時再測試您的自定義域名。

## 驗證設置

設置完成後，您可以通過以下方式驗證：

1. 在瀏覽器中訪問您的自定義域名
2. 檢查瀏覽器地址欄是否顯示鎖頭圖標（表示 SSL 已啟用）
3. 測試網站的所有功能是否正常運作

## 常見問題

**Q: 為什麼我的域名還沒有生效？**
A: DNS 更新需要時間傳播。請等待 1-24 小時，如果仍未生效，檢查 DNS 記錄是否正確設置。

**Q: 如何使用根域名（不帶 www）？**
A: 大多數平台支援根域名，但需要使用 A 記錄或 ALIAS/ANAME 記錄。具體方法請查看您所用部署平台的文檔。

**Q: SSL 憑證沒有自動生成怎麼辦？**
A: 確保 DNS 記錄已正確指向部署平台。SSL 憑證通常在 DNS 生效後 1-2 小時內自動生成。
