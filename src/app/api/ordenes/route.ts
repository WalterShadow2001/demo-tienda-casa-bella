import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get("estado") || undefined;
    const ordenes = await prisma.orden.findMany({
      where: estado ? { estado } : undefined,
      orderBy: { creadoEn: "desc" },
    });
    return NextResponse.json(ordenes);
  } catch (e) {
    console.error("[GET /api/ordenes]", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clienteNombre,
      clienteEmail,
      clienteTelefono,
      direccion,
      ciudad,
      codigoPostal,
      items,
      subtotal,
      envio,
      total,
      cupon,
      estado,
    } = body;

    if (
      !clienteNombre ||
      !clienteEmail ||
      !clienteTelefono ||
      !direccion ||
      !ciudad ||
      !codigoPostal ||
      !items ||
      subtotal == null ||
      envio == null ||
      total == null
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const orden = await prisma.orden.create({
      data: {
        clienteNombre,
        clienteEmail,
        clienteTelefono,
        direccion,
        ciudad,
        codigoPostal,
        items: typeof items === "string" ? items : JSON.stringify(items),
        subtotal: Number(subtotal),
        envio: Number(envio),
        total: Number(total),
        estado: estado || "pendiente",
        cupon: cupon || null,
      },
    });
    return NextResponse.json(orden, { status: 201 });
  } catch (e) {
    console.error("[POST /api/ordenes]", e);
    return NextResponse.json({ error: "Error al crear orden" }, { status: 500 });
  }
}
