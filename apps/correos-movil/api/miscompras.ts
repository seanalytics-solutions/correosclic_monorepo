// api/miscompras.ts
import { MisComprasSchemaDB, MisComprasType } from "../schemas/schemas";

export const myIp = process.env.EXPO_PUBLIC_API_URL || "";

export async function obtenerMisCompras(id: number): Promise<MisComprasType[]> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/transactions/user/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const miscompras = MisComprasSchemaDB.parse(json);
  return miscompras;
}

// src/api/pedidos.ts
import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// src/api/miscompras.ts (o donde tengas PedidoBackend)
export type PedidoBackend = {
  id: number;
  fecha: string;
  total: number | string;
  productos: Array<{
    id: number;
    cantidad: number;
    producto: {
      id: number;
      nombre: string;
      descripcion?: string;
      categoria?: string;
      id_category?: number;
      precio: number | string;
      imagen?: string; // por si existía este campo
      images?: { id: number; url: string; orden: number }[];
    };
  }>;
};

export async function obtenerPedidosPorUsuario(profileId: string) {
  const { data } = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/api/pedido/user/${profileId}`,
  );
  return data;
}

export async function obtenerFactura(invoiceId: number) {
  const { data } = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/api/facturas?id=${invoiceId}`,
  );
  return data;
}
