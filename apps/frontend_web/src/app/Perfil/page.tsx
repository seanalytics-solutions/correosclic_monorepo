"use client";

import React, { useState, useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { Plantilla } from "../../components/plantilla";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

export default function Perfil() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [foto, setFoto] = useState(
    "https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg"
  );
  const [metodoPago] = useState("Tarjeta Visa terminada en 3421");

  const [error, setError] = useState("");

  useEffect(() => {
    setNombre(clerkUser?.firstName || "");
    setApellidos(clerkUser?.lastName || "");
    setCorreo(clerkUser?.primaryEmailAddress?.emailAddress || "");
    setCelular(clerkUser?.phoneNumbers?.[0]?.phoneNumber || "");
    setFoto(
      clerkUser?.imageUrl ||
        "https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg"
    );
  }, [clerkUser]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handlePedidos = () => {
    router.push("/pedidos");
  };
  const handleCupones = () => {
    router.push("/cupones");
  };
  const handlePago = () => {
    router.push("/pago");
  };

  const handleConfiguracion = () => {
    router.push("/Editar-Perfil");
  };

  if (!isLoaded) {
    return (
      <Plantilla>
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE1484] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </Plantilla>
    );
  }

  if (!isSignedIn) {
    return (
      <Plantilla>
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <p className="text-red-500">Acceso denegado. Redirigiendo...</p>
          </div>
        </div>
      </Plantilla>
    );
  }

  // --- RENDERIZADO DEL PERFIL (MODO SOLO LECTURA) ---
  return (
    <Plantilla>
      <div className="min-h-screen flex flex-col items-center justify-start px-8 py-12">
        <div className="max-w-4xl w-full mx-auto p-8 px-8 py-8 bg-white rounded-xl shadow-lg">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* BLOQUE SUPERIOR: Foto, Nombre, Correo y BOTÓN ENGRANAJE */}
          <div className="flex items-center mb-12 border-b pb-8">
            <div className="relative mr-6">
              <img
                src={foto}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
            </div>

            {/* Contenedor de Nombre, Correo y Botón de Configuración */}
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                {/* Nombre y Apellido */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {nombre} {apellidos}
                </h2>
                {/* Correo Electrónico como texto de contacto */}
                <p className="text-gray-600">{correo}</p>
              </div>
              {/* Botón de Configuración (Engranaje) */}
              <button
                className="mt-4 md:mt-0 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition text-md font-semibold flex items-center gap-2 shadow-md"
                onClick={handleConfiguracion}
              >
                Configuración
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BLOQUE DE DATOS PERSONALES (Ahora solo lectura estática) */}
          <div className="w-full py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Datos personales
              </h3>
            </div>

            {/* Grid de 2 columnas para campos de SÓLO LECTURA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Nombre */}
              <CampoPerfil
                label="Nombre"
                value={nombre}
                readOnly={true}
                type="text"
                isReadOnlyStyle={true}
              />
              {/* Apellidos */}
              <CampoPerfil
                label="Apellidos"
                value={apellidos}
                readOnly={true}
                type="text"
                isReadOnlyStyle={true}
              />
              {/* Correo Electrónico */}
              <CampoPerfil
                label="Correo Electrónico"
                value={correo}
                readOnly={true}
                type="email"
                isReadOnlyStyle={true}
              />
              {/* Celular */}
              <CampoPerfil
                label="Celular"
                value={celular}
                readOnly={true}
                type="tel"
                isReadOnlyStyle={true}
              />

              {/* Método de Pago (Solo lectura) */}
              <CampoPerfil
                label="Método de pago"
                value={metodoPago}
                readOnly={true}
                type="text"
                isReadOnlyStyle={true}
              />
            </div>
          </div>

          {/* TÍTULO DE ADMINISTRACIÓN */}
          <h1 className="text-xl font-bold mt-12 mb-6 text-center text-gray-800">
            Administrar
          </h1>

          {/* BLOQUE DE BOTONES DE NAVEGACIÓN */}
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
              {/* Botón Pedidos */}
              <BotonNavegacion onClick={handlePedidos}>Pedidos</BotonNavegacion>
              {/* Botón Cupones */}
              <BotonNavegacion onClick={handleCupones}>Cupones</BotonNavegacion>
              {/* Botón Pago */}
              <BotonNavegacion onClick={handlePago}>Pago</BotonNavegacion>
            </div>
          </div>

          {/* Botón Cerrar sesión */}
          <div className="text-center mt-12">
            <button
              className="bg-white text-gray-700 py-2 px-8 rounded border border-gray-300 shadow-sm hover:bg-gray-100 transition"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>{" "}
        {/* Fin max-w-4xl */}
      </div>
    </Plantilla>
  );
}

// Componente helper para simplificar el JSX de los campos de input
// Se eliminó la lógica de 'onChange' ya que esta página es solo lectura
type CampoPerfilProps = {
  label: string;
  value: string;
  readOnly?: boolean;
  type?: string;
  isReadOnlyStyle?: boolean;
};

const CampoPerfil: React.FC<CampoPerfilProps> = ({
  label,
  value,
  readOnly = true,
  type = "text",
  isReadOnlyStyle = true,
}) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      className={`w-full border rounded-lg p-3 transition ${readOnly || isReadOnlyStyle ? "bg-gray-50 text-gray-700 border-gray-200 cursor-default" : "bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-500"}`}
    />
  </div>
);

// Componente helper para simplificar el JSX de los botones de navegación
type BotonNavegacionProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const BotonNavegacion: React.FC<BotonNavegacionProps> = ({
  children,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="bg-pink-600 hover:bg-pink-700 text-white py-12 px-6 rounded-xl text-lg font-semibold transition transform hover:scale-[1.03] shadow-lg"
  >
    {children}
  </button>
);
