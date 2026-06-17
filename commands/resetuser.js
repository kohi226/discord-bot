// ============================================================
// commands/resetuser.js — Xóa lịch sử nhận mã của một user
// ============================================================

const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");
const { errorEmbed, successEmbed, infoEmbed, isAdmin } = require("../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resetuser")
    .setDescription("🔄 Xóa lịch sử nhận mã của một user (admin)")
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("User cần reset")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({
        embeds: [errorEmbed("Bạn không có quyền sử dụng lệnh này.")],
        ephemeral: true,
      });
    }

    const target = interaction.options.getUser("user");

    // Kiểm tra xem user đã từng nhận mã chưa
    const record = db.getClaimed(target.id);
    if (!record) {
      return interaction.reply({
        embeds: [infoEmbed("Không có dữ liệu", `**${target.tag}** chưa từng nhận mã.`)],
        ephemeral: true,
      });
    }

    const wasReset = db.resetUser(target.id);

    if (wasReset) {
      return interaction.reply({
        embeds: [
          successEmbed(
            "Đã reset",
            `Lịch sử nhận mã của **${target.tag}** đã được xóa.\n` +
            `Mã trước đó: \`${record.code}\`\n` +
            "User này có thể nhận mã mới."
          ),
        ],
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        embeds: [errorEmbed("Không thể xóa dữ liệu. Thử lại hoặc kiểm tra log.")],
        ephemeral: true,
      });
    }
  },
};
