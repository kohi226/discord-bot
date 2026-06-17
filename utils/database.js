// ============================================================
// utils/database.js — Quản lý dữ liệu bằng JSON (không cần compile)
// ============================================================

const fs   = require("fs");
const path = require("path");

const DATA_DIR     = path.join(__dirname, "..", "data");
const CODES_FILE   = path.join(DATA_DIR, "codes.json");
const CLAIMED_FILE = path.join(DATA_DIR, "claimed.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readCodes() {
  if (!fs.existsSync(CODES_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(CODES_FILE, "utf8")); }
  catch { return {}; }
}
function writeCodes(data) {
  fs.writeFileSync(CODES_FILE, JSON.stringify(data, null, 2), "utf8");
}
function readClaimed() {
  if (!fs.existsSync(CLAIMED_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(CLAIMED_FILE, "utf8")); }
  catch { return {}; }
}
function writeClaimed(data) {
  fs.writeFileSync(CLAIMED_FILE, JSON.stringify(data, null, 2), "utf8");
}

function initDatabase() {
  if (!fs.existsSync(CODES_FILE))   writeCodes({});
  if (!fs.existsSync(CLAIMED_FILE)) writeClaimed({});
  console.log("[DB] JSON database sẵn sàng:", DATA_DIR);
}

function addCode(roleId, code) {
  const data = readCodes();
  if (!data[roleId]) data[roleId] = [];
  const trimmed = code.trim();
  for (const codes of Object.values(data)) {
    if (codes.includes(trimmed)) return false;
  }
  data[roleId].push(trimmed);
  writeCodes(data);
  return true;
}

function removeCode(roleId, code) {
  const data = readCodes();
  if (!data[roleId]) return false;
  const idx = data[roleId].indexOf(code.trim());
  if (idx === -1) return false;
  data[roleId].splice(idx, 1);
  writeCodes(data);
  return true;
}

function popCode(roleId) {
  const data = readCodes();
  if (!data[roleId] || data[roleId].length === 0) return null;
  const code = data[roleId].shift();
  writeCodes(data);
  return code;
}

function countCodes(roleId) {
  const data = readCodes();
  return data[roleId] ? data[roleId].length : 0;
}

function listCodes(roleId) {
  const data = readCodes();
  return data[roleId] ?? [];
}

function getClaimed(userId) {
  const data = readClaimed();
  return data[userId] ?? null;
}

function setClaimed(userId, roleId, code) {
  const data = readClaimed();
  data[userId] = { role_id: roleId, code, claimed_at: new Date().toISOString() };
  writeClaimed(data);
}

function resetUser(userId) {
  const data = readClaimed();
  if (!data[userId]) return false;
  delete data[userId];
  writeClaimed(data);
  return true;
}

module.exports = {
  initDatabase, addCode, removeCode, popCode,
  countCodes, listCodes, getClaimed, setClaimed, resetUser,
};
