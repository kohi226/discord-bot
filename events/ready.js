// ============================================================
// events/ready.js — Chạy khi bot kết nối Discord thành công
// ============================================================

const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true, // Chỉ chạy 1 lần

  execute(client) {
    console.log(`[BOT] Đã đăng nhập với tên: ${client.user.tag}`);
    console.log(`[BOT] Đang phục vụ ${client.guilds.cache.size} server(s)`);

    // Đặt trạng thái hoạt động
    client.user.setActivity("Phát mã kích hoạt 🎟️", {
      type: ActivityType.Watching,
    });
  },
};
