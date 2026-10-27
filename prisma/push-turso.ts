import { createClient } from "@libsql/client";
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

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("TURSO_DATABASE_URL is required");
  process.exit(1);
}

const client = createClient({ url, authToken });

const statements = [
  `CREATE TABLE IF NOT EXISTS Categoria (
    id TEXT PRIMARY KEY NOT NULL,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
  )`,
  `CREATE TABLE IF NOT EXISTS Producto (
    id TEXT PRIMARY KEY NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio REAL NOT NULL,
    precioOferta REAL,
    categoriaId TEXT NOT NULL,
    imagenes TEXT NOT NULL,
    especificaciones TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 0,
    destacado INTEGER NOT NULL DEFAULT 0,
    creadoEn TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (categoriaId) REFERENCES Categoria(id)
  )`,
  `CREATE TABLE IF NOT EXISTS Orden (
    id TEXT PRIMARY KEY NOT NULL,
    clienteNombre TEXT NOT NULL,
    clienteEmail TEXT NOT NULL,
    clienteTelefono TEXT NOT NULL,
    direccion TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    codigoPostal TEXT NOT NULL,
    items TEXT NOT NULL,
    subtotal REAL NOT NULL,
    envio REAL NOT NULL,
    total REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    cupon TEXT,
    creadoEn TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS Cupon (
    codigo TEXT PRIMARY KEY NOT NULL,
    descuento REAL NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1
  )`,
];

async function main() {
  for (const stmt of statements) {
    await client.execute(stmt);
    console.log("✓ Executed:", stmt.slice(0, 60), "...");
  }
  console.log("Schema pushed to Turso successfully");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
