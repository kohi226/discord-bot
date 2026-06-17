// ============================================================
// commands/removecode.js — Xóa một mã cụ thể khỏi kho
// ============================================================

const { SlashCommandBuilder } = require("discord.js");
const config = require("../config/config");
const db = require("../utils/database");
const { errorEmbed, successEmbed, isAdmin } = require("../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removecode")
    .setDescription("➖ Xóa một mã khỏi kho (admin)")
    .addStringOption((opt) =>
      opt
        .setName("role_id")
        .setDescription("ID của role")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("code")
        .setDescription("Mã cần xóa")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({
        embeds: [errorEmbed("Bạn không có quyền sử dụng lệnh này.")],
        ephemeral: true,
      });
    }

    const roleId = interaction.options.getString("role_id");
    const code   = interaction.options.getString("code");

    const removed = db.removeCode(roleId, code);
    const roleName = config.ROLE_LABELS[roleId] ?? roleId;

    if (!removed) {
      return interaction.reply({
        embeds: [errorEmbed(`Không tìm thấy mã \`${code}\` trong kho của **${roleName}**.`)],
        ephemeral: true,
      });
    }

    const remaining = db.countCodes(roleId);
    return interaction.reply({
      embeds: [
        successEmbed(
          "Đã xóa mã",
          `Mã \`${code}\` đã bị xóa khỏi **${roleName}**.\n` +
          `Kho còn lại: **${remaining}** mã.`
        ),
      ],
      ephemeral: true,
    });
  },
};
