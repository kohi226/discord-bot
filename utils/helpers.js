// ============================================================
// utils/helpers.js — Các hàm tiện ích dùng chung
// ============================================================

const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const config = require("../config/config");

/**
 * Tạo embed chính để gửi vào channel (bảng lấy mã)
 */
function buildMainEmbed() {
  const embed = new EmbedBuilder()
    .setColor(config.EMBED.COLOR)
    .setTitle(config.EMBED.TITLE)
    .setDescription(config.EMBED.DESCRIPTION)
    .setFooter({ text: config.EMBED.FOOTER })
    .setTimestamp();

  if (config.EMBED.THUMBNAIL) {
    embed.setThumbnail(config.EMBED.THUMBNAIL);
  }

  return embed;
}

/**
 * Tạo ActionRow chứa nút "Lấy Mã"
 */
function buildClaimButton() {
  const buttonStyleMap = {
    Primary: ButtonStyle.Primary,
    Secondary: ButtonStyle.Secondary,
    Success: ButtonStyle.Success,
    Danger: ButtonStyle.Danger,
  };

  const btn = new ButtonBuilder()
    .setCustomId(config.BUTTON.CUSTOM_ID)
    .setLabel(config.BUTTON.LABEL)
    .setStyle(buttonStyleMap[config.BUTTON.STYLE] ?? ButtonStyle.Primary);

  if (config.BUTTON.EMOJI) {
    btn.setEmoji(config.BUTTON.EMOJI);
  }

  return new ActionRowBuilder().addComponents(btn);
}

/**
 * Tạo embed thông báo lỗi (màu đỏ)
 */
function errorEmbed(description) {
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle("❌ Lỗi")
    .setDescription(description)
    .setTimestamp();
}

/**
 * Tạo embed thành công (màu xanh)
 */
function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Tạo embed thông tin (màu vàng)
 */
function infoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(0xf39c12)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Kiểm tra user có quyền admin không
 * (dựa theo ADMIN_ROLE_IDS trong config)
 */
function isAdmin(member) {
  if (!member) return false;
  return config.ADMIN_ROLE_IDS.some((rid) => member.roles.cache.has(rid));
}

/**
 * Tìm role ID ưu tiên cao nhất mà user đang có
 * Dựa theo thứ tự trong ROLE_PRIORITY
 * @returns {string|null}
 */
function getHighestPriorityRole(member) {
  for (const roleId of config.ROLE_PRIORITY) {
    if (member.roles.cache.has(roleId)) return roleId;
  }
  return null;
}

module.exports = {
  buildMainEmbed,
  buildClaimButton,
  errorEmbed,
  successEmbed,
  infoEmbed,
  isAdmin,
  getHighestPriorityRole,
};
