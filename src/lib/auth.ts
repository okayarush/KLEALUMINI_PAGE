// Simple admin authentication using environment variables
// Replace with proper Supabase Auth in production

export function verifyAdminCredentials(email: string, password: string): boolean {
  return (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  );
}

export const ADMIN_COOKIE_NAME = 'kle_admin_session';
export const ADMIN_COOKIE_VALUE = 'authenticated';
