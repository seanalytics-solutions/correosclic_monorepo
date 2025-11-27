// hooks/useProfile.ts
'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';
import { usuarioPorId, actualizarUsuarioPorId, uploadAvatar } from '@/services/profileService';
import { User } from '@/schemas/auth';

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (id: number) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const profile = await usuarioPorId(id);
      // Actualizar el usuario en el estado de autenticación
      updateUser({
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
      });
      return profile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user?.id) throw new Error('Usuario no autenticado');

    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await actualizarUsuarioPorId(profileData as User, user.id);
      
      // Actualizar el usuario en el estado de autenticación
      updateUser({
        name: updatedProfile.name || updatedProfile.nombre,
        email: updatedProfile.email || updatedProfile.correo,
        avatar: updatedProfile.avatar || updatedProfile.imagen,
      });
      
      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (file: File) => {
    if (!user?.id) throw new Error('Usuario no autenticado');

    setIsLoading(true);
    setError(null);
    try {
      const avatarUrl = await uploadAvatar(file, user.id);
      
      // Actualizar el avatar en el estado de autenticación
      updateUser({ avatar: avatarUrl });
      
      return avatarUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile: user,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
  };
};