// ============================================================
// config/config.js — Tùy chỉnh toàn bộ giao diện và cấu hình
// ============================================================

module.exports = {
  // ── Bot cơ bản ──────────────────────────────────────────
  BOT_TOKEN: process.env.BOT_TOKEN,
  CLIENT_ID: "1514941536029118594",       // Application ID
  GUILD_ID: "1164530814281842698",         // Server ID (để register slash commands nhanh)

  // ── Giao diện Embed ─────────────────────────────────────
  EMBED: {
    COLOR: 0x5865f2,                       // Màu thanh bên trái embed (hex number)
    TITLE: "🎁 Nhận Mã Của Bạn",
    DESCRIPTION:
      "Nhấn nút bên dưới để nhận mã kích hoạt của bạn.\n" +
      "Mỗi tài khoản chỉ được nhận **một lần duy nhất**.",
    FOOTER: "© 2025 Code Distribution Bot • Liên hệ admin nếu gặp vấn đề",
    THUMBNAIL: "",                         // URL ảnh thumbnail (để trống = không dùng)
  },

  // ── Nút bấm ─────────────────────────────────────────────
  BUTTON: {
    LABEL: "Lấy Mã",
    EMOJI: "🎟️",
    STYLE: "Primary",                      // Primary | Secondary | Success | Danger
    CUSTOM_ID: "claim_code",
  },

  // ── Ưu tiên Role (index nhỏ hơn = ưu tiên cao hơn) ──────
  // Điền Role ID thực tế của server vào đây
  ROLE_PRIORITY: [
    "1516653900122423396",   // Role A — ưu tiên cao nhất
    "1516653252303785984",   // Role B
    "1516653577785966754",   // Role C — ưu tiên thấp nhất
  ],

  // ── Phân phối mã theo role ───────────────────────────────
  // Key = Role ID, Value = tên hiển thị (dùng trong lệnh admin)
  ROLE_LABELS: {
    "1516653900122423396": "Role A",
    "1516653252303785984": "Role B",
    "1516653577785966754": "Role C",
  },

  // ── Gửi mã qua DM hay Ephemeral? ────────────────────────
  // "dm"        = Gửi tin nhắn riêng (DM)
  // "ephemeral" = Tin nhắn chỉ user thấy trong server
  DELIVERY_METHOD: "ephemeral",

  // ── Quyền Admin ─────────────────────────────────────────
  // Chỉ những user có một trong các Role ID này mới dùng được lệnh admin
  ADMIN_ROLE_IDS: ["1164589069603459234", "1196367761056727091", "1165915375637102654"],
};
