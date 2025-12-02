"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaArrowLeft } from "react-icons/fa";
import CarruselLogin from "@/components/CarruselLogin";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Registro = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isChecked, setIsChecked] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const router = useRouter();

  const handleSwitchChange = () => setIsChecked(!isChecked);

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error con Google");
    }
  };

  const handleFacebookLogin = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error con Facebook");
    }
  };

  const validarFormulario = () => {
    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      setError("Todos los campos son obligatorios.");
      setSuccessMessage("");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("El correo electrónico no es válido.");
      setSuccessMessage("");
      return false;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      setSuccessMessage("");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegistro = async () => {
    if (!isLoaded || !validarFormulario()) return;

    setAuthLoading(true);
    setError("");

    try {
      // Paso 1: Iniciar el proceso de sign-up
      await signUp.create({
        emailAddress: correo,
        password: contrasena,
        firstName: nombre.split(" ")[0],
        lastName: nombre.split(" ").slice(1).join(" ") || "",
      });

      // Paso 2: Preparar la verificación de email
      await signUp.prepareEmailAddressVerification({ 
        strategy: "email_code" 
      });

      setPendingVerification(true);
      setSuccessMessage("¡Código de verificación enviado a tu correo!");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error al crear cuenta");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;

    setAuthLoading(true);
    setError("");

    try {
      // Paso 3: Intentar completar la verificación
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        // Paso 4: Establecer la sesión activa
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Código de verificación inválido");
    } finally {
      setAuthLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Verificar correo
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Ingresa el código que enviamos a {correo}
          </p>
          
          <form onSubmit={handleVerification}>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <input
                type="text"
                placeholder="Código de verificación"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full outline-none bg-transparent text-center"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={authLoading || !isLoaded}
              className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200"
            >
              {authLoading ? "Verificando..." : "Verificar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex h-auto w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        <div className="w-full md:w-1/2 px-3 sm:px-6 py-3 flex flex-col justify-center min-h-0">
          <div className="flex justify-center mb-2 sm:mb-3">
            <Image
              src="/logoCorreos.png"
              alt="Logo Correos"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20"
              priority
            />
          </div>

          <div className="flex items-center justify-center mb-3 sm:mb-4 relative">
            <Link href="/login" className="absolute left-0 text-gray-600 hover:text-pink-600 transition">
              <FaArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </Link>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Registrarse</h2>
            <div className="absolute right-0 min-w-[20px] h-[20px] sm:min-w-[24px] sm:h-[24px] invisible" />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-2 text-center">{successMessage}</p>}

          <button
            onClick={handleRegistro}
            disabled={authLoading || !isLoaded}
            className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4"
          >
            {authLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <div className="w-full flex items-center my-2 sm:my-3">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-xs">o</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-blue-50 transition duration-200"
            >
              <Image src="/facebook-icon.png" alt="Facebook" width={16} height={16} className="sm:w-5 sm:h-5" />
              <span className="ml-2 text-xs sm:text-sm text-gray-800 font-medium">
                Registrarse con Facebook
              </span>
            </button>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-red-50 transition duration-200"
            >
              <Image src="/google-icon.png" alt="Google" width={16} height={16} className="sm:w-5 sm:h-5" />
              <span className="ml-2 text-xs sm:text-sm text-gray-800 font-medium">
                Registrarse con Google
              </span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-pink-600 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <CarruselLogin />
      </div>
    </div>
  );
};

export default Registro;