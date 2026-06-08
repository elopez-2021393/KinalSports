// src/features/tournaments/screens/TournamentDetail.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useTournaments } from '../hooks/useTournaments.js';

const TournamentDetail = () => {
  const route = useRoute();
  const { tournamentId } = route.params;
  const { tournaments, loading, registerTeam } = useTournaments();
  const [teamId, setTeamId] = useState('');

  const tournament = tournaments.find((t) => t.id === tournamentId);

  const handleRegister = async () => {
    if (!teamId.trim()) {
      Alert.alert('Error', 'Por favor ingresa el ID del equipo');
      return;
    }

    const result = await registerTeam(tournamentId, teamId);
    if (result.success) {
      Alert.alert('Éxito', 'Equipo inscrito correctamente');
      setTeamId('');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Torneo no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card>
          <Text style={styles.name}>{tournament.name}</Text>
          <Text style={styles.sport}>{tournament.sport}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha inicio:</Text>
            <Text style={styles.value}>{tournament.startDate}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha fin:</Text>
            <Text style={styles.value}>{tournament.endDate}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Equipos:</Text>
            <Text style={styles.value}>{tournament.currentTeams}/{tournament.maxTeams}</Text>
          </View>

          {tournament.prize && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Premio:</Text>
              <Text style={styles.value}>{tournament.prize}</Text>
            </View>
          )}

          {tournament.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.description}>{tournament.description}</Text>
            </View>
          )}

          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: tournament.status === 'ACTIVE' ? COLORS.success : COLORS.secondary }]} />
            <Text style={styles.statusText}>{tournament.status}</Text>
          </View>

          {tournament.status === 'ACTIVE' && tournament.currentTeams < tournament.maxTeams && (
            <View style={styles.registerSection}>
              <Text style={styles.sectionTitle}>Inscribir Equipo</Text>
              <Input
                label="ID del Equipo"
                placeholder="Ingresa el ID de tu equipo"
                value={teamId}
                onChangeText={setTeamId}
                keyboardType="default"
              />
              <Button
                title="Inscribir Equipo"
                onPress={handleRegister}
                loading={loading}
                style={styles.button}
              />
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sport: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  registerSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  button: {
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default TournamentDetail;
