const domains = ["okekang.my.id", "jaycok.my.id"];

export function generateRandomEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const user = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${user}@${domain}`;
}
