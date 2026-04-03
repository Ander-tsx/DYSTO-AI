"use client";

import { useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";

const MOCK_USERS = [
  {
    id: 1,
    nombre: "Lucia Mendez",
    correo: "lucia@dystoai.com",
    rol: "Admin",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Carlos Rivas",
    correo: "carlos.rivas@dystoai.com",
    rol: "Usuario",
    estado: "Suspendido",
  },
  {
    id: 3,
    nombre: "Mara Solis",
    correo: "mara.solis@dystoai.com",
    rol: "Usuario",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Diego Perez",
    correo: "diego.perez@dystoai.com",
    rol: "Usuario",
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "Nina Duarte",
    correo: "nina.duarte@dystoai.com",
    rol: "Admin",
    estado: "Suspendido",
  },
];

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== selectedUser.id)
    );
    closeDeleteModal();
  };

  return (
    <AdminLayout>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-100">Gestion de Usuarios</h1>
          <p className="text-sm text-zinc-400">
            Administra cuentas, permisos y estado de acceso dentro del marketplace.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900/70">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Nombre
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Correo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Rol
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-zinc-900/80">
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-zinc-100">
                      {user.nombre}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                      {user.correo}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                      {user.rol}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      <Badge variant={user.estado === "Activo" ? "success" : "error"}>
                        {user.estado}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Button
                        variant="danger"
                        size="sm"
                        className="border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-white"
                        onClick={() => openDeleteModal(user)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-zinc-400">
                      No hay usuarios para mostrar.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Eliminar Usuario"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-zinc-100"
              onClick={closeDeleteModal}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-white"
              onClick={confirmDeleteUser}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p className="text-sm text-zinc-200">
          {selectedUser
            ? `¿Estas seguro de que deseas eliminar a ${selectedUser.nombre}?`
            : "¿Estas seguro de que deseas eliminar este usuario?"}
        </p>
      </Modal>
    </AdminLayout>
  );
}
