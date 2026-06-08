// src/features/tournaments/hooks/useTournaments.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments');
      const data = response.data.data || response.data;
      
      const mappedTournaments = data.map((tournament) => ({
        id: tournament._id || tournament.id,
        name: tournament.tournamentName,
        description: tournament.description,
        sport: tournament.sport,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        maxTeams: tournament.maxTeams,
        currentTeams: tournament.currentTeams || 0,
        status: tournament.status,
        prize: tournament.prize,
      }));
      
      setTournaments(mappedTournaments);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments/my-tournaments');
      const data = response.data.data || response.data;
      
      const mappedMyTournaments = data.map((tournament) => ({
        id: tournament._id || tournament.id,
        name: tournament.tournamentName,
        description: tournament.description,
        sport: tournament.sport,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        maxTeams: tournament.maxTeams,
        currentTeams: tournament.currentTeams || 0,
        status: tournament.status,
        prize: tournament.prize,
        teamId: tournament.teamId,
      }));
      
      setMyTournaments(mappedMyTournaments);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar mis torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerTeam = useCallback(async (tournamentId, teamId) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/tournaments/register/${tournamentId}`, { teamId });
      await fetchMyTournaments();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al inscribir equipo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTournaments]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    fetchMyTournaments();
  }, [fetchMyTournaments]);

  return {
    tournaments,
    myTournaments,
    loading,
    error,
    refetchTournaments: fetchTournaments,
    refetchMyTournaments: fetchMyTournaments,
    registerTeam,
  };
};
