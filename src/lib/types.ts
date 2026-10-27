export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta: number | null;
  categoriaId: string;
  imagenes: string;
  especificaciones: string | null;
  stock: number;
  rating: number;
  destacado: boolean;
  creadoEn: string | Date;
  categoria?: { id: string; nombre: string; slug: string };
};

export type Orden = {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  items: string;
  subtotal: number;
  envio: number;
  total: number;
  estado: string;
  cupon: string | null;
  creadoEn: string | Date;
};

export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
};

export type Cupon = {
  codigo: string;
  descuento: number;
  activo: boolean;
};
