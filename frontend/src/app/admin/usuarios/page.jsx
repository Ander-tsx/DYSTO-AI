"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsuariosPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
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

    const openToggleModal = (user) => {
        setSelectedUser(user);
        setIsToggleModalOpen(true);
    };

    const closeToggleModal = () => {
        setIsToggleModalOpen(false);
        setSelectedUser(null);
    };

    const confirmToggleUser = async () => {
        if (!selectedUser) return;
        try {
            const newStatus = !selectedUser.is_active;
            await api.patch(`/users/${selectedUser.id}/`, { is_active: newStatus });
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, is_active: newStatus } : u));
        } catch (err) {
            setError(err.response?.data?.detail || 'No se pudo actualizar el estado del usuario.');
        } finally {
            closeToggleModal();
        }
    };

    // Mapa de colores por rol
    const roleBadgeVariant = (role) => {
        if (role === 'admin') return 'error';
        if (role === 'vendor') return 'success';
        return 'default';
    };

    const usersTableContent = (() => {
        if (loading) {
            return Array.from({ length: 5 }, (_, rowIdx) => (
                <tr key={`row-${rowIdx}`}>
                    {Array.from({ length: 5 }, (_, colIdx) => (
                        <td key={`col-${rowIdx}-${colIdx}`} className="px-5 py-4">
                            <div className="h-4 animate-pulse rounded bg-zinc-800" />
                        </td>
                    ))}
                </tr>
            ));
        }

        if (filteredUsers.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-zinc-400">
                        No hay usuarios para mostrar.
                    </td>
                </tr>
            );
        }

        return filteredUsers.map((user) => (
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
                    {currentUser?.id !== user.id && currentUser?.email !== user.email && (
                        <Button
                            variant={user.is_active ? "danger" : "default"}
                            size="sm"
                            className={user.is_active 
                                ? "border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-white"
                                : "border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/20 hover:text-white"
                            }
                            onClick={() => openToggleModal(user)}
                        >
                            {user.is_active ? "Desactivar" : "Activar"}
                        </Button>
                    )}
                </td>
            </tr>
        ));
    })();

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
                                {usersTableContent}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Modal confirmación de cambio de estado */}
            <Modal
                isOpen={isToggleModalOpen}
                onClose={closeToggleModal}
                title={selectedUser?.is_active ? "Desactivar Usuario" : "Activar Usuario"}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-zinc-100"
                            onClick={closeToggleModal}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant={selectedUser?.is_active ? "danger" : "default"}
                            size="sm"
                            className={selectedUser?.is_active
                                ? "border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-white"
                                : "border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/20 hover:text-white"
                            }
                            onClick={confirmToggleUser}
                        >
                            {selectedUser?.is_active ? "Desactivar" : "Activar"}
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-zinc-200">
                    {selectedUser
                        ? `¿Estás seguro de ${selectedUser.is_active ? 'desactivar' : 'activar'} a ${selectedUser.full_name || selectedUser.email}?`
                        : '¿Estás seguro?'}
                </p>
            </Modal>
        </AdminLayout>
    );
}
