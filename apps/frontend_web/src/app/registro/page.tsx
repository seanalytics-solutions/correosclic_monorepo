"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaArrowLeft, FaCheck } from "react-icons/fa";
import CarruselLogin from "@/components/CarruselLogin";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Registro = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useUser();
  const [isChecked, setIsChecked] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  // Variantes de animación para las transiciones
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    loading: { scale: 0.98 },
    verified: { 
      scale: [1, 1.1, 1],
      backgroundColor: "#22c55e",
      transition: { duration: 0.5 }
    }
  };

  const handleSwitchChange = () => setIsChecked(!isChecked);

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/",
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
        redirectUrl: "/",
        redirectUrlComplete: "/",
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

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !validarFormulario()) return;

    setAuthLoading(true);
    setError("");

    try {
      // Paso 1: Iniciar el proceso de sign-up
      await signUp.create({
        emailAddress: correo,
        password: contrasena,
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
        // Mostrar animación de verificado
        setIsVerified(true);
        
        // Paso 4: Establecer la sesión activa después de la animación
        setTimeout(async () => {
          await setActive({ session: completeSignUp.createdSessionId });
          router.push("/");
        }, 500);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Código de verificación inválido");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex h-auto w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        <div className="w-full md:w-1/2 px-3 sm:px-6 py-3 flex flex-col justify-center min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {pendingVerification ? (
              <motion.div
                key="verification"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Image
                      src="/logoCorreos.png"
                      alt="Logo Correos"
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                      priority
                    />
                  </motion.div>
                </div>

                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-semibold text-gray-800 mb-4 text-center"
                >
                  Verificar correo
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-600 mb-6 text-center"
                >
                  Ingresa el código que enviamos a <strong>{correo}</strong>
                </motion.p>
                
                <form onSubmit={handleVerification}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center border border-gray-300 rounded-full px-4 py-3 mb-4"
                  >
                    <input
                      type="text"
                      placeholder="Código de verificación"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full outline-none bg-transparent text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mb-4 text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={authLoading || !isLoaded || isVerified}
                    variants={buttonVariants}
                    initial="idle"
                    animate={isVerified ? "verified" : authLoading ? "loading" : "idle"}
                    whileHover={!isVerified && !authLoading ? { scale: 1.02 } : {}}
                    whileTap={!isVerified && !authLoading ? { scale: 0.98 } : {}}
                    className={`w-full text-white rounded-full py-3 font-semibold flex items-center transition-colors duration-200 justify-center gap-2 ${
                      isVerified ? "bg-green-500" : "bg-pink-600 hover:bg-pink-700"
                    }`}
                  >
                    {isVerified ? (
                      <>
                        
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          ¡Verificado!
                        </motion.span>
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FaCheck />
                        </motion.span>
                      </>
                    ) : authLoading ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        Verificando...
                      </motion.span>
                    ) : (
                      "Verificar"
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => setPendingVerification(false)}
                    className="w-full mt-4 text-gray-500 text-sm hover:text-pink-600 transition"
                  >
                    ← Volver al registro
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
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

          <form onSubmit={handleRegistro}>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                required
                onChange={(e) => setNombre(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Apellido"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Correo electrónico"
                required
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
                required
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
                required
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-2 text-center">{successMessage}</p>}

            <button
              type="submit"
              disabled={authLoading || !isLoaded}
              className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4"
            >
              {authLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="w-full flex items-center my-2 sm:my-3">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-xs">o</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="space-y-4 mb-6">
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-blue-50 transition duration-200"
            >
              <Image src="/facebook-icon.png" alt="Facebook" width={16} height={16} className="sm:w-5 sm:h-5" />
              <span className="ml-2 text-xs sm:text-sm text-gray-800 font-medium">
                Registrarse con Facebook
              </span>
            </button>

            <button
              type="button"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CarruselLogin />
      </div>
    </div>
  );
};

export default Registro;