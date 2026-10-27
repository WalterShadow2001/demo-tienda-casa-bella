import { cookies } from "next/headers";

export const ADMIN_COOKIE = "casa_bella_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function setAdminCookie() {
  const c = await cookies();
  c.set({
    name: ADMIN_COOKIE,
    value: "true",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const val = c.get(ADMIN_COOKIE);
  return val?.value === "true";
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
