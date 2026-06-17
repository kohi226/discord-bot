// ============================================================
// events/interactionCreate.js — Xử lý mọi interaction (button + slash)
// ============================================================

const { Events } = require("discord.js");
const config = require("../config/config");
const db = require("../utils/database");
const { errorEmbed, successEmbed, infoEmbed, getHighestPriorityRole } = require("../utils/helpers");

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction, client) {

    // ── 1. Xử lý Slash Commands ──────────────────────────────
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(`[CMD] Lỗi khi chạy /${interaction.commandName}:`, err);
        const reply = { embeds: [errorEmbed("Đã xảy ra lỗi khi thực thi lệnh.")], ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply).catch(() => {});
        } else {
          await interaction.reply(reply).catch(() => {});
        }
      }
      return;
    }

    // ── 2. Xử lý nút "Lấy Mã" ───────────────────────────────
    if (interaction.isButton() && interaction.customId === config.BUTTON.CUSTOM_ID) {
      await handleClaimButton(interaction);
      return;
    }
  },
};

// ── Logic xử lý nút lấy mã ──────────────────────────────────
async function handleClaimButton(interaction) {
  // Defer ngay để tránh timeout (3s)
  await interaction.deferReply({ ephemeral: true });

  const member = interaction.member;
  const userId = interaction.user.id;

  // 2a. Kiểm tra xem user đã nhận mã chưa
  const existing = db.getClaimed(userId);
  if (existing) {
    return interaction.editReply({
      embeds: [
        infoEmbed(
          "Bạn đã nhận mã rồi",
          `Bạn đã nhận mã vào **<t:${Math.floor(new Date(existing.claimed_at).getTime() / 1000)}:f>**.\n` +
          "Mỗi tài khoản chỉ được nhận một lần. Vui lòng liên hệ admin nếu cần hỗ trợ."
        ),
      ],
    });
  }

  // 2b. Tìm role ưu tiên cao nhất của user
  const roleId = getHighestPriorityRole(member);
  if (!roleId) {
    return interaction.editReply({
      embeds: [
        errorEmbed(
          "Bạn không có role phù hợp để nhận mã.\n" +
          "Vui lòng liên hệ admin để được cấp role."
        ),
      ],
    });
  }

  // 2c. Lấy (và xóa ngay) một mã từ kho
  let code;
  try {
    code = db.popCode(roleId);
  } catch (err) {
    console.error("[CLAIM] Lỗi đọc/ghi database:", err);
    return interaction.editReply({
      embeds: [errorEmbed("Lỗi hệ thống khi truy xuất mã. Vui lòng thử lại hoặc báo admin.")],
    });
  }

  if (!code) {
    const roleName = config.ROLE_LABELS[roleId] ?? roleId;
    return interaction.editReply({
      embeds: [
        errorEmbed(
          `Kho mã cho **${roleName}** đã hết.\n` +
          "Vui lòng liên hệ admin để bổ sung."
        ),
      ],
    });
  }

  // 2d. Ghi lại lịch sử nhận mã
  try {
    db.setClaimed(userId, roleId, code);
  } catch (err) {
    console.error("[CLAIM] Không ghi được lịch sử, hoàn trả mã:", err);
    // Hoàn trả mã vào kho nếu ghi lịch sử thất bại
    db.addCode(roleId, code);
    return interaction.editReply({
      embeds: [errorEmbed("Lỗi lưu dữ liệu. Mã chưa được cấp, vui lòng thử lại.")],
    });
  }

  // 2e. Gửi mã — DM hoặc Ephemeral tùy config
  const roleName = config.ROLE_LABELS[roleId] ?? roleId;
  const codeEmbed = successEmbed(
    "Mã của bạn",
    `🎉 Chúc mừng **${interaction.user.username}**!\n\n` +
    `**Role:** ${roleName}\n` +
    `**Mã của bạn:**\n\`\`\`\n${code}\n\`\`\`\n` +
    "_Hãy lưu mã lại cẩn thận, bạn sẽ không nhận được mã khác._"
  );

  if (config.DELIVERY_METHOD === "dm") {
    try {
      await interaction.user.send({ embeds: [codeEmbed] });
      await interaction.editReply({
        embeds: [successEmbed("Đã gửi mã!", "Mã đã được gửi vào hộp thư riêng (DM) của bạn. 📬")],
      });
    } catch {
      // User tắt DM → fallback sang ephemeral
      await interaction.editReply({
        embeds: [
          codeEmbed,
          infoEmbed("Lưu ý", "Không thể gửi DM (bạn đã tắt tin nhắn riêng). Mã hiển thị tại đây và chỉ bạn nhìn thấy."),
        ],
      });
    }
  } else {
    // Ephemeral — chỉ user thấy trong server
    await interaction.editReply({ embeds: [codeEmbed] });
  }

  console.log(`[CLAIM] User ${interaction.user.tag} (${userId}) nhận mã role ${roleName}`);
}
