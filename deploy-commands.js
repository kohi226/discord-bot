// ============================================================
// deploy-commands.js — Đăng ký Slash Commands lên Discord
// Chạy một lần: node deploy-commands.js
// ============================================================

const { REST, Routes } = require("discord.js");
const fs   = require("fs");
const path = require("path");
const config = require("./config/config");

const commands = [];
const cmdDir = path.join(__dirname, "commands");

for (const file of fs.readdirSync(cmdDir).filter((f) => f.endsWith(".js"))) {
  const cmd = require(path.join(cmdDir, file));
  if (cmd.data) commands.push(cmd.data.toJSON());
}

const rest = new REST().setToken(config.BOT_TOKEN);

(async () => {
  try {
    console.log(`[DEPLOY] Đăng ký ${commands.length} lệnh...`);

    // Đăng ký cho một server cụ thể (nhanh, dùng khi dev)
    await rest.put(
      Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
      { body: commands }
    );

    console.log("[DEPLOY] ✅ Đã đăng ký thành công!");
    console.log("Các lệnh:", commands.map((c) => `/${c.name}`).join(", "));
  } catch (err) {
    console.error("[DEPLOY] Lỗi:", err);
  }
})();
