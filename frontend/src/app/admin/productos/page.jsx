"use client";

import { useState, useMemo } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Badge from "../../../components/ui/Badge";

const MOCK_PRODUCTS = [
  {
    id: 1,
    imagen: "https://s1.significados.com/foto/producto-og.jpg",
    titulo: "Monitor 27 pulgadas 4K",
    vendedor: "TechVendor",
    precio: 450.99,
    stock: 12,
    estado: "Activo",
  },
  {
    id: 2,
    imagen: "https://s1.significados.com/foto/producto-og.jpg",
    titulo: "Laptop Gaming RTX 4070",
    vendedor: "ProGamer",
    precio: 1299.99,
    stock: 5,
    estado: "Activo",
  },
  {
    id: 3,
    imagen: "https://s1.significados.com/foto/producto-og.jpg",
    titulo: "Teclado Mecanico RGB",
    vendedor: "TechVendor",
    precio: 129.5,
    stock: 0,
    estado: "Inactivo",
  },
  {
    id: 4,
    imagen: "https://s1.significados.com/foto/producto-og.jpg",
    titulo: "Mouse Inalambrico Pro",
    vendedor: "PeripheralsCorp",
    precio: 79.99,
    stock: 25,
    estado: "Activo",
  },
  {
    id: 5,
    imagen: "https://s1.significados.com/foto/producto-og.jpg",
    titulo: "Auriculares Wireless ANC",
    vendedor: "ProGamer",
    precio: 249,
    stock: 8,
    estado: "Activo",
  },
  {
    id: 6,
    imagen: "https://s1.significados.com/foto/producto-og.jpg",
    titulo: "Webcam 1080p Full HD",
    vendedor: "PeripheralsCorp",
    precio: 89.99,
    stock: 3,
    estado: "Inactivo",
  },
];

const VENDORS = ["Todos", "TechVendor", "ProGamer", "PeripheralsCorp"];
const STATES = ["Todos", "Activo", "Inactivo"];

export default function AdminProductsPage() {
  const [filterState, setFilterState] = useState("Todos");
  const [filterVendor, setFilterVendor] = useState("Todos");

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchState = filterState === "Todos" || product.estado === filterState;
      const matchVendor =
        filterVendor === "Todos" || product.vendedor === filterVendor;
      return matchState && matchVendor;
    });
  }, [filterState, filterVendor]);

  return (
    <AdminLayout>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-100">Gestion de Productos</h1>
          <p className="text-sm text-zinc-400">
            Revisa el inventario y estado de todos los productos en el marketplace.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label htmlFor="filter-state" className="mb-2 block text-sm font-medium text-zinc-300">
              Estado
            </label>
            <select
              id="filter-state"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 transition-colors hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="filter-vendor" className="mb-2 block text-sm font-medium text-zinc-300">
              Vendedor
            </label>
            <select
              id="filter-vendor"
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 transition-colors hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              {VENDORS.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900/70">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Imagen
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Titulo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Vendedor
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Precio
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Stock
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-zinc-900/80">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="h-10 w-10 overflow-hidden rounded bg-zinc-800">
                        <img
                          src={product.imagen}
                          alt={product.titulo}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-zinc-100">
                      {product.titulo}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                      {product.vendedor}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                      ${product.precio.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                      {product.stock}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      <Badge variant={product.estado === "Activo" ? "success" : "error"}>
                        {product.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-zinc-400">
                      No hay productos para mostrar con los filtros aplicados.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
