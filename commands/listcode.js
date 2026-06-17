// ============================================================
// commands/listcode.js — Xem số lượng và danh sách mã còn lại
// ============================================================

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../config/config");
const db = require("../utils/database");
const { errorEmbed, isAdmin } = require("../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listcode")
    .setDescription("📋 Xem số mã còn lại theo role (admin)")
    .addStringOption((opt) =>
      opt
        .setName("role_id")
        .setDescription("ID role cần xem (bỏ trống = xem tất cả)")
        .setRequired(false)
    )
    .addBooleanOption((opt) =>
      opt
        .setName("show_codes")
        .setDescription("Hiển thị cả danh sách mã? (mặc định: ẩn)")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({
        embeds: [errorEmbed("Bạn không có quyền sử dụng lệnh này.")],
        ephemeral: true,
      });
    }

    const roleId    = interaction.options.getString("role_id");
    const showCodes = interaction.options.getBoolean("show_codes") ?? false;

    // Danh sách roles cần xem
    const targetRoles = roleId
      ? [roleId]
      : config.ROLE_PRIORITY;

    const embed = new EmbedBuilder()
      .setColor(config.EMBED.COLOR)
      .setTitle("📦 Thống kê kho mã")
      .setTimestamp();

    let totalCodes = 0;

    for (const rid of targetRoles) {
      const roleName = config.ROLE_LABELS[rid] ?? rid;
      const count    = db.countCodes(rid);
      totalCodes += count;

      let fieldValue = `Số mã còn lại: **${count}**`;

      if (showCodes && count > 0) {
        const codes = db.listCodes(rid);
        // Tối đa 10 mã hiển thị để tránh vượt giới hạn Discord
        const preview = codes.slice(0, 10).map((c) => `\`${c}\``).join(", ");
        fieldValue +=
          `\n${preview}` +
          (codes.length > 10 ? `\n...và ${codes.length - 10} mã nữa` : "");
      }

      embed.addFields({ name: `🔹 ${roleName}`, value: fieldValue });
    }

    embed.setFooter({ text: `Tổng cộng: ${totalCodes} mã trong tất cả role` });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
