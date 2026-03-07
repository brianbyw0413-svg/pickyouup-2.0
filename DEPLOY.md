# PickYouUP 2.0 部署指南

## 專案結構

```
pickyouup-2.0/
├── src/
│   ├── App.tsx         # 前端主程式（已加入表單驗證、loading states）
│   ├── main.tsx        # React 入口
│   └── index.css       # Tailwind 樣式
├── server/
│   ├── index.js        # Express 後端 API（含 LINE Webhook、管理後台）
│   └── schema.sql      # Supabase 資料庫結構
├── .env.example        # 環境變數範本
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 1. 前端部署（Vercel / Netlify）

### 部署步驟

1. **建立 `.env` 檔案**
   ```bash
   cp .env.example .env
   ```
   
   填入實際值：
   ```
   VITE_SUPABASE_URL=你的Supabase專案網址
   VITE_SUPABASE_ANON_KEY=你的Supabase匿名金鑰
   VITE_API_BASE=你的後端API網址（部署後填入）
   ```

2. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Update: Add form validation and backend API"
   git push origin main
   ```

3. **在 Vercel 部署**
   - 前往 [vercel.com](https://vercel.com)
   - Import GitHub 專案
   - 設定環境變數
   - Deploy

---

## 2. 後端部署（Railway / Render / Fly.io）

### 環境變數設定

在部署平台上設定以下環境變數：

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# PayUni 金流（可選）
VITE_PAYUNI_MERCHANT_NO=U03424091

# LINE Bot
LINE_CHANNEL_SECRET=your_channel_secret
LINE_ACCESS_TOKEN=your_access_token
LINE_USER_ID=your_line_user_id

# 伺服器
PORT=3000
NODE_ENV=production
```

### Railway 部署

1. 前往 [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. 設定環境變數
4. 部署完成後會獲得網址，例如：`https://pickyouup-api.railway.app`

---

## 3. Supabase 資料庫設定

### 建立資料表

1. 登入 [supabase.com](https://supabase.com)
2. 開啟 SQL Editor
3. 複製 `server/schema.sql` 內容並執行

或者使用 Table Editor 手動建立：

**orders 表**
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| name | text | 乘客姓名 |
| phone | text | 電話 |
| address | text | 地址 |
| date | date | 日期 |
| time | time | 時間 |
| flight | text | 航班 |
| mode | text | 接送模式 |
| car_type | text | 車型 |
| amount | integer | 金額 |
| status | text | 訂單狀態 |
| payment_status | text | 付款狀態 |
| driver_id | uuid | 司機 ID |
| driver_name | text | 司機姓名 |
| driver_phone | text | 司機電話 |
| created_at | timestamp | 建立時間 |

**drivers 表**
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| name | text | 司機姓名 |
| phone | text | 電話 |
| car_type | text | 車型 |
| license_plate | text | 車牌 |
| is_active | boolean | 是否可派單 |

---

## 4. LINE Bot 設定

### 建立 LINE Developers 帳號

1. 前往 [LINE Developers](https://developers.line.biz/)
2. 建立 Provider
3. 建立 Messaging API Channel
4. 取得 Channel ID、Channel Secret、Access Token

### 設定 Webhook

1. 在 LINE Developers 後台設定 Webhook URL：
   ```
   https://你的伺服器網址/api/webhook/line
   ```

2. 將 LINE_USER_ID 設定到環境變數（用於派單通知）

### LINE 派單格式

使用者傳送以下格式的訊息會自動建立訂單：
```
姓名:王小明 電話:0912345678 地址:台北市信義區某路123 時間:2024/01/15 14:00 航班:JX713
```

---

## 5. 管理後台

部署完成後訪問：
```
https://你的伺服器網址/admin
```

功能：
- 📋 查看所有訂單
- 🔍 篩選訂單狀態
- 👨‍✈️ 派單給司機
- ➕ 新增/管理司機
- 📊 訂單統計

---

## 6. 完整部署檢查清單

- [ ] Supabase 資料表建立完成
- [ ] 前端部署到 Vercel
- [ ] 後端部署到 Railway
- [ ] 環境變數設定完成
- [ ] LINE Webhook 設定完成
- [ ] 管理後台可訪問
- [ ] 測試下單流程

---

## 開發模式

```bash
# 安裝依賴
npm install

# 啟動前端
npm run dev

# 啟動後端（另一個終端機）
npm run server
```

後端運行於：http://localhost:3000
管理後台：http://localhost:3000/admin
