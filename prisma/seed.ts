import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env manually so we don't depend on parent folder .env overrides
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?(.*?)"?\s*$/);
      if (m) {
        process.env[m[1]] = m[2].replace(/^"|"$/g, "");
      }
    }
  }
}
loadEnv();

import { createClient } from "@libsql/client";
import { randomUUID } from "crypto";
import {
  CATEGORIAS,
  PRODUCTOS,
  CUPONES,
  ORDENES,
} from "../src/lib/seed-data";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient({ url, authToken });

async function exec(sql: string, args: unknown[] = []) {
  await client.execute({ sql, args: args as never });
}

async function main() {
  console.log("🌱 Seeding Casa Bella...");

  // Clean (order matters due to FK)
  await exec("DELETE FROM Orden");
  await exec("DELETE FROM Producto");
  await exec("DELETE FROM Cupon");
  await exec("DELETE FROM Categoria");

  // Categorias
  const catMap = new Map<string, string>();
  for (const c of CATEGORIAS) {
    const id = randomUUID();
    await exec("INSERT INTO Categoria (id, nombre, slug) VALUES (?, ?, ?)", [
      id,
      c.nombre,
      c.slug,
    ]);
    catMap.set(c.slug, id);
    console.log("✓ Categoria:", c.nombre);
  }

  // Productos
  for (const p of PRODUCTOS) {
    const catId = catMap.get(p.categoriaSlug);
    if (!catId) throw new Error(`Missing categoria for ${p.categoriaSlug}`);
    const id = randomUUID();
    await exec(
      "INSERT INTO Producto (id, nombre, descripcion, precio, precioOferta, categoriaId, imagenes, especificaciones, stock, rating, destacado, creadoEn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))",
      [
        id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.precioOferta ?? null,
        catId,
        p.imagenes,
        p.especificaciones ? JSON.stringify(p.especificaciones) : null,
        p.stock,
        p.rating,
        p.destacado ? 1 : 0,
      ]
    );
    console.log("✓ Producto:", p.nombre);
  }

  // Cupones
  for (const c of CUPONES) {
    await exec(
      "INSERT INTO Cupon (codigo, descuento, activo) VALUES (?, ?, ?)",
      [c.codigo, c.descuento, c.activo ? 1 : 0]
    );
    console.log("✓ Cupon:", c.codigo);
  }

  // Ordenes
  for (const o of ORDENES) {
    const id = randomUUID();
    await exec(
      "INSERT INTO Orden (id, clienteNombre, clienteEmail, clienteTelefono, direccion, ciudad, codigoPostal, items, subtotal, envio, total, estado, cupon, creadoEn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))",
      [
        id,
        o.clienteNombre,
        o.clienteEmail,
        o.clienteTelefono,
        o.direccion,
        o.ciudad,
        o.codigoPostal,
        o.items,
        o.subtotal,
        o.envio,
        o.total,
        o.estado,
        o.cupon ?? null,
      ]
    );
    console.log("✓ Orden:", o.clienteNombre);
  }

  console.log("✅ Seed completo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => client.close());
