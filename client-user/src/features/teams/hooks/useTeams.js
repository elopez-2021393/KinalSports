// src/features/teams/hooks/useTeams.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/teams');
      const data = response.data.data || response.data;
      
      const mappedTeams = data.map((team) => ({
        id: team._id || team.id,
        name: team.teamName,
        image: team.photo,
        description: team.description,
        maxPlayers: team.maxPlayers,
        currentPlayers: team.currentPlayers || 0,
        sport: team.sport,
      }));
      
      setTeams(mappedTeams);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTeams = useCallback(async () => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/teams/me/mis-equipos');
      const data = response.data.data || response.data;
      
      const mappedMyTeams = data.map((team) => ({
        id: team._id || team.id,
        name: team.teamName,
        image: team.photo,
        description: team.description,
        maxPlayers: team.maxPlayers,
        currentPlayers: team.currentPlayers || 0,
        sport: team.sport,
        isCaptain: team.isCaptain || false,
      }));
      
      setMyTeams(mappedMyTeams);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar mis equipos');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const joinTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/teams/${teamId}/join`);
      await fetchMyTeams();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al unirse al equipo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams]);

  const leaveTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/teams/${teamId}/leave`);
      await fetchMyTeams();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al salir del equipo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams]);

  const createTeam = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post('/teams', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data.data || response.data;
      await fetchMyTeams();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear equipo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  return {
    teams,
    myTeams,
    loading,
    error,
    refetchTeams: fetchTeams,
    refetchMyTeams: fetchMyTeams,
    joinTeam,
    leaveTeam,
    createTeam,
  };
};
