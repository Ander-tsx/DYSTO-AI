"use client";

import { useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function AdminProfilePage() {
  const [profileData, setProfileData] = useState({
    nombre: "Lucia Mendez",
    telefono: "+34 912 345 678",
    correo: "lucia@dystoai.com",
  });

  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordNuevaConfirm: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log("Guardando perfil:", profileData);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    console.log("Actualizando contraseña:", passwordData);
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-zinc-100">Mi Perfil</h1>
          <p className="text-sm text-zinc-400">
            Administra tu información personal y seguridad.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-5 text-lg font-semibold text-zinc-100">
              Información Personal
            </h2>

            <div className="space-y-4">
              <Input
                label="Nombre Completo"
                type="text"
                name="nombre"
                value={profileData.nombre}
                onChange={handleProfileChange}
                className="focus:border-cyan-500 focus:ring-cyan-500"
              />

              <Input
                label="Teléfono"
                type="text"
                name="telefono"
                value={profileData.telefono}
                onChange={handleProfileChange}
                className="focus:border-cyan-500 focus:ring-cyan-500"
              />

              <div>
                <label htmlFor="correo" className="mb-2 block text-sm font-medium text-zinc-300">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  value={profileData.correo}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-800/50 px-4 py-2.5 text-zinc-500"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  No puedes cambiar tu correo electrónico.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </form>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-5 text-lg font-semibold text-zinc-100">Seguridad</h2>

            <div className="space-y-4">
              <Input
                label="Contraseña Actual"
                type="password"
                name="passwordActual"
                value={passwordData.passwordActual}
                onChange={handlePasswordChange}
                placeholder="Ingresa tu contraseña actual"
                className="focus:border-cyan-500 focus:ring-cyan-500"
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                name="passwordNueva"
                value={passwordData.passwordNueva}
                onChange={handlePasswordChange}
                placeholder="Ingresa tu nueva contraseña"
                className="focus:border-cyan-500 focus:ring-cyan-500"
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                name="passwordNuevaConfirm"
                value={passwordData.passwordNuevaConfirm}
                onChange={handlePasswordChange}
                placeholder="Confirma tu nueva contraseña"
                className="focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div className="mt-6">
              <Button variant="primary" type="submit">
                Actualizar Contraseña
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
