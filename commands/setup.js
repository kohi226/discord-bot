// ============================================================
// commands/setup.js — Gửi bảng lấy mã vào channel hiện tại
// Chỉ admin sử dụng được
// ============================================================

const { SlashCommandBuilder } = require("discord.js");
const { buildMainEmbed, buildClaimButton, errorEmbed, isAdmin } = require("../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("📌 Gửi bảng lấy mã vào channel này (chỉ admin)"),

  async execute(interaction) {
    // Kiểm tra quyền admin
    if (!isAdmin(interaction.member)) {
      return interaction.reply({
        embeds: [errorEmbed("Bạn không có quyền sử dụng lệnh này.")],
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    // Gửi embed + nút vào channel
    await interaction.channel.send({
      embeds: [buildMainEmbed()],
      components: [buildClaimButton()],
    });

    await interaction.editReply({
      content: "✅ Đã gửi bảng lấy mã thành công!",
    });
  },
};
