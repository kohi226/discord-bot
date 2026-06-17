// ============================================================
// commands/addcode.js — Thêm mã vào kho của một role
// ============================================================

const { SlashCommandBuilder } = require("discord.js");
const config = require("../config/config");
const db = require("../utils/database");
const { errorEmbed, successEmbed, isAdmin } = require("../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcode")
    .setDescription("➕ Thêm mã vào kho của một role (admin)")
    .addStringOption((opt) =>
      opt
        .setName("role_id")
        .setDescription("ID của role cần thêm mã")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("code")
        .setDescription("Mã cần thêm")
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

    // Kiểm tra role có trong config không
    if (!config.ROLE_PRIORITY.includes(roleId)) {
      return interaction.reply({
        embeds: [
          errorEmbed(
            `Role ID \`${roleId}\` không có trong danh sách cấu hình.\n` +
            "Kiểm tra lại \`ROLE_PRIORITY\` trong \`config/config.js\`."
          ),
        ],
        ephemeral: true,
      });
    }

    const added = db.addCode(roleId, code);
    const roleName = config.ROLE_LABELS[roleId] ?? roleId;

    if (!added) {
      return interaction.reply({
        embeds: [errorEmbed(`Mã \`${code}\` đã tồn tại trong hệ thống.`)],
        ephemeral: true,
      });
    }

    const remaining = db.countCodes(roleId);
    return interaction.reply({
      embeds: [
        successEmbed(
          "Đã thêm mã",
          `Mã \`${code}\` đã được thêm vào **${roleName}**.\n` +
          `Kho hiện có: **${remaining}** mã.`
        ),
      ],
      ephemeral: true,
    });
  },
};
