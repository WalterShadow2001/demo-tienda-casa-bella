import { NextResponse } from "next/server";
import { setAdminCookie, validatePassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password || !validatePassword(password)) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }
    setAdminCookie();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[POST /api/admin/login]", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
