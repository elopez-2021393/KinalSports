// src/features/profile/hooks/useProfile.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/users/profile');
      const data = response.data.data || response.data;
      
      const mappedProfile = {
        id: data._id || data.id,
        displayName: data.displayName,
        phone: data.phone,
        favoriteSports: Array.isArray(data.favoriteSports) 
          ? data.favoriteSports 
          : (data.favoriteSports ? data.favoriteSports.split(',').map(s => s.trim()) : []),
        avatar: data.avatar,
      };
      
      setProfile(mappedProfile);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        displayName: profileData.displayName,
        phone: profileData.phone,
        favoriteSports: Array.isArray(profileData.favoriteSports)
          ? profileData.favoriteSports
          : profileData.favoriteSports.split(',').map(s => s.trim()),
      };

      const response = await userClient.put('/users/profile', payload);
      const data = response.data.data || response.data;
      
      const updatedProfile = {
        id: data._id || data.id,
        displayName: data.displayName,
        phone: data.phone,
        favoriteSports: Array.isArray(data.favoriteSports) 
          ? data.favoriteSports 
          : (data.favoriteSports ? data.favoriteSports.split(',').map(s => s.trim()) : []),
        avatar: data.avatar,
      };
      
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      
      return { success: true, data: updatedProfile };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};
