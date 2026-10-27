import { cookies } from "next/headers";

export const ADMIN_COOKIE = "casa_bella_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export function setAdminCookie() {
  cookies().set({
    name: ADMIN_COOKIE,
    value: "true",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export function clearAdminCookie() {
  cookies().set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function isAdmin(): boolean {
  const c = cookies().get(ADMIN_COOKIE);
  return c?.value === "true";
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
