"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import api from "@/lib/axios";

export default function AdminUsuariosPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Conectado a API real: GET /api/users/
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/users/');
                setUsers(res.data.results || res.data);
            } catch (err) {
                setError(err.response?.data?.detail || 'No se pudieron cargar los usuarios.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            u.email?.toLowerCase().includes(q) ||
            u.full_name?.toLowerCase().includes(q)
        );
    });

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const confirmDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await api.delete(`/users/${selectedUser.id}/`);
            setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        } catch (err) {
            setError(err.response?.data?.detail || 'No se pudo eliminar el usuario.');
        } finally {
            closeDeleteModal();
        }
    };

    // Mapa de colores por rol
    const roleBadgeVariant = (role) => {
        if (role === 'admin') return 'error';
        if (role === 'vendor') return 'success';
        return 'default';
    };

    return (
        <AdminLayout>
            <section className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-zinc-100">Gestión de Usuarios</h1>
                    <p className="text-sm text-zinc-400">
                        Administra cuentas, permisos y estado de acceso dentro del marketplace.
                    </p>
                </div>

                {/* Buscador */}
                <div>
                    <label htmlFor="user-search" className="mb-2 block text-sm font-medium text-zinc-300">
                        Buscar usuario
                    </label>
                    <input
                        id="user-search"
                        type="text"
                        placeholder="Email o nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition hover:border-zinc-700 focus:border-zinc-600"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        {error}
                    </div>
                )}

                {/* Tabla */}
                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-900/70">
                                <tr>
                                    {["Nombre", "Email", "Rol", "Estado", "Acciones"].map(col => (
                                        <th
                                            key={col}
                                            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 ${col === "Acciones" ? "text-right" : "text-left"}`}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            {[...Array(5)].map((__, j) => (
                                                <td key={j} className="px-5 py-4">
                                                    <div className="h-4 animate-pulse rounded bg-zinc-800" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-8 text-center text-sm text-zinc-400">
                                            No hay usuarios para mostrar.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="transition-colors hover:bg-zinc-900/80">
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-zinc-100">
                                                {user.full_name || '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                                                {user.email}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                <Badge variant={roleBadgeVariant(user.role)}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                <Badge variant={user.is_active ? "success" : "error"}>
                                                    {user.is_active ? "Activo" : "Suspendido"}
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Modal confirmación de eliminación */}
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
                        ? `¿Estás seguro de eliminar a ${selectedUser.full_name || selectedUser.email}?`
                        : '¿Estás seguro de eliminar este usuario?'}
                </p>
            </Modal>
        </AdminLayout>
    );
}
