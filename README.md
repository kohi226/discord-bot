# 🎟️ Discord Code Distribution Bot

Bot Discord phát mã kích hoạt (code/key) theo role người dùng.  
Xây dựng bằng **discord.js v14** + **SQLite** (better-sqlite3).

---

## 📁 Cấu trúc thư mục

```
discord-code-bot/
├── commands/
│   ├── setup.js          # Gửi bảng lấy mã vào channel
│   ├── addcode.js        # Thêm mã vào role
│   ├── removecode.js     # Xóa mã khỏi role
│   ├── listcode.js       # Xem thống kê mã còn lại
│   └── resetuser.js      # Reset lịch sử nhận mã của user
├── events/
│   ├── ready.js          # Xử lý khi bot online
│   └── interactionCreate.js  # Xử lý button + slash commands
├── utils/
│   ├── database.js       # Toàn bộ logic SQLite
│   └── helpers.js        # Hàm tiện ích (embed, button, ...)
├── config/
│   └── config.js         # ⚙️ File cấu hình chính
├── data/                 # SQLite DB tự tạo khi chạy
├── deploy-commands.js    # Script đăng ký slash commands
├── index.js              # Entry point
└── package.json
```

---

## ⚙️ Cài đặt

### Bước 1 — Cài Node.js

Tải Node.js **18+** tại https://nodejs.org

### Bước 2 — Tạo Bot Discord

1. Vào https://discord.com/developers/applications → **New Application**
2. Vào tab **Bot** → **Add Bot** → Copy **Token**
3. Vào **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`, `Send Messages in Threads`
4. Dùng URL được tạo để mời bot vào server

### Bước 3 — Cài đặt dependencies

```bash
npm install
```

### Bước 4 — Cấu hình bot

Mở file `config/config.js` và điền đầy đủ:

```js
BOT_TOKEN: "Token bot của bạn",
CLIENT_ID: "Application ID (tìm trong Developer Portal)",
GUILD_ID:  "ID server Discord (chuột phải server → Copy ID)",

ROLE_PRIORITY: [
  "123456789012345678",   // Role A (ưu tiên cao nhất)
  "234567890123456789",   // Role B
],

ROLE_LABELS: {
  "123456789012345678": "VIP",
  "234567890123456789": "Member",
},

ADMIN_ROLE_IDS: ["345678901234567890"],  // Role admin
```

> 💡 Để lấy Role ID: Vào Discord → Server Settings → Roles → chuột phải role → Copy ID  
> (Cần bật Developer Mode trong User Settings → Advanced)

### Bước 5 — Đăng ký Slash Commands

```bash
node deploy-commands.js
```

Chạy **một lần duy nhất** (hoặc khi có lệnh mới).

### Bước 6 — Khởi động bot

```bash
npm start
```

---

## 🚀 Sử dụng

### Thiết lập kênh phát mã
1. Vào channel mong muốn
2. Gõ `/setup` → Bot sẽ gửi embed có nút **Lấy Mã**

### Thêm mã vào kho
```
/addcode role_id:123456789012345678 code:MYCODE-XXXX-1234
```

### Xem thống kê
```
/listcode                          → Xem tất cả role
/listcode role_id:123...           → Xem một role cụ thể
/listcode role_id:123... show_codes:True  → Hiện cả danh sách mã
```

### Xóa mã
```
/removecode role_id:123... code:MYCODE-XXXX-1234
```

### Reset user (cho nhận lại)
```
/resetuser user:@TênUser
```

---

## 🔄 Luồng hoạt động

```
User nhấn nút "Lấy Mã"
        ↓
Bot kiểm tra: đã nhận chưa?
  ├── Đã nhận → Thông báo, dừng
  └── Chưa nhận
        ↓
      Tìm role ưu tiên cao nhất của user
        ↓
      Lấy mã từ kho (xóa ngay khỏi DB)
        ↓
      Ghi lịch sử nhận
        ↓
      Gửi mã qua DM / ephemeral message
```

---

## ⚙️ Tùy chỉnh giao diện

Tất cả trong `config/config.js`:

| Thuộc tính | Mô tả |
|---|---|
| `EMBED.COLOR` | Màu thanh bên embed (hex) |
| `EMBED.TITLE` | Tiêu đề embed |
| `EMBED.DESCRIPTION` | Nội dung embed |
| `EMBED.FOOTER` | Footer embed |
| `EMBED.THUMBNAIL` | URL ảnh thumbnail |
| `BUTTON.LABEL` | Tên nút |
| `BUTTON.EMOJI` | Emoji trên nút |
| `BUTTON.STYLE` | Primary / Secondary / Success / Danger |
| `DELIVERY_METHOD` | `"ephemeral"` hoặc `"dm"` |

---

## 🛡️ Xử lý lỗi

| Tình huống | Bot phản hồi |
|---|---|
| User không có role hợp lệ | Thông báo lỗi ephemeral |
| User đã nhận mã | Thông báo thời gian nhận trước đó |
| Kho mã trống | Thông báo hết mã, báo admin |
| User tắt DM | Fallback hiển thị mã ephemeral trong server |
| Lỗi đọc/ghi DB | Thông báo lỗi, hoàn trả mã vào kho |
| Thiếu quyền admin | Từ chối, chỉ user thấy |

---

## 📝 Ghi chú

- Dữ liệu lưu trong `data/codes.db` — **giữ lại khi restart**
- Mỗi mã chỉ được cấp cho **1 user duy nhất**
- Mỗi user chỉ nhận **1 mã duy nhất**
- Để chạy 24/7: dùng [PM2](https://pm2.keymetrics.io/) — `pm2 start index.js --name code-bot`
