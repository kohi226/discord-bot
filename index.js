// ============================================================
// index.js — Entry point chính của bot
// ============================================================

const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const fs   = require("fs");
const path = require("path");

const config = require("./config/config");
const { initDatabase } = require("./utils/database");

// ── Khởi tạo CSDL ───────────────────────────────────────────
initDatabase();

// ── Khởi tạo Discord Client ──────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// ── Nạp Slash Commands ───────────────────────────────────────
client.commands = new Collection();
const cmdDir = path.join(__dirname, "commands");

for (const file of fs.readdirSync(cmdDir).filter((f) => f.endsWith(".js"))) {
  const command = require(path.join(cmdDir, file));
  if (!command.data || !command.execute) {
    console.warn(`[CMD] Bỏ qua ${file}: thiếu data hoặc execute`);
    continue;
  }
  client.commands.set(command.data.name, command);
  console.log(`[CMD] Nạp lệnh: /${command.data.name}`);
}

// ── Nạp Events ───────────────────────────────────────────────
const eventDir = path.join(__dirname, "events");

for (const file of fs.readdirSync(eventDir).filter((f) => f.endsWith(".js"))) {
  const event = require(path.join(eventDir, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`[EVENT] Nạp event: ${event.name}`);
}

// ── Xử lý lỗi chưa được bắt ─────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error("[ERROR] Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("[ERROR] Uncaught Exception:", err);
});

// ── Đăng nhập ────────────────────────────────────────────────
client.login(config.BOT_TOKEN).catch((err) => {
  console.error("[BOT] Không thể đăng nhập. Kiểm tra BOT_TOKEN:", err.message);
  process.exit(1);
});
