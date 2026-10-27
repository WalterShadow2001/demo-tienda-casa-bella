import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orden = await prisma.orden.findUnique({ where: { id } });
    if (!orden) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }
    return NextResponse.json(orden);
  } catch (e) {
    console.error("[GET /api/ordenes/[id]]", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const { estado } = body;
    const valid = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];
    if (!valid.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    const updated = await prisma.orden.update({
      where: { id },
      data: { estado },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PUT /api/ordenes/[id]]", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
