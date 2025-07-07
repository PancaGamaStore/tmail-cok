const domains = ["okekang.my.id", "jaycok.my.id"];

export function generateRandomUsername() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function generateRandomEmail() {
  const user = generateRandomUsername();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${user}@${domain}`;
}
