'use client'

import { useSignIn } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import CarruselLogin from '@/components/CarruselLogin'

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded) return
    
    setAuthLoading(true)
    setError('')

    try {
      // Paso 1: Iniciar el proceso de sign-in
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      })

      // Paso 2: Verificar si el sign-in está completo
      if (signInAttempt.status === 'complete') {
        // Paso 3: Establecer la sesión activa
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/')
      } else {
        // Si requiere verificación adicional (MFA, etc.)
        console.log('Se requiere verificación adicional:', signInAttempt.status)
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Error al iniciar sesión')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!isLoaded) return
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Error con Google')
    }
  }

  const handleFacebookLogin = async () => {
    if (!isLoaded) return
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_facebook',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Error con Facebook')
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex items-center justify-center p-2">
      <div className="flex h-full max-h-full w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logoCorreos.png"
              alt="Logo Correos"
              width={150}
              height={150}
              priority
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>
            
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
             

              <Link href="/recuperar-contrasena" className="text-black hover:underline text-xs">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={authLoading || !isLoaded}
              className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4"
            >
              {authLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="w-full flex items-center my-2 sm:my-3">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-xs">o</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="space-y-2 mb-3">
            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-blue-50 transition duration-200"
            >
              <Image src="/facebook-icon.png" alt="Facebook" width={24} height={24} />
              <span className="ml-3 text-base text-gray-800 font-medium">
                Ingresar con Facebook
              </span>
            </button>
            
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-red-50 transition duration-200"
            >
              <Image src="/google-icon.png" alt="Google" width={24} height={24} />
              <span className="ml-3 text-base text-gray-800 font-medium">
                Ingresar con Google
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-pink-600 hover:underline">
              Registrate
            </Link>
          </p>
        </div>

        {/* Carrusel */}
          <CarruselLogin />
      </div>
    </div>
  )
}