export function getAdminEmails(): string[] {
  const adminEnv = process.env.ADMIN_EMAILS || "adnanajmeri70@gmail.com";
  return adminEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminList = getAdminEmails();
  return adminList.includes(email.trim().toLowerCase());
}
