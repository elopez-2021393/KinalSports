// src/features/tournaments/screens/TournamentsList.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useTournaments } from '../hooks/useTournaments.js';

const TournamentsList = () => {
  const navigation = useNavigation();
  const { tournaments, loading, error, refetch } = useTournaments();

  const handleTournamentPress = (tournament) => {
    navigation.navigate('TournamentDetail', { tournamentId: tournament.id });
  };

  if (loading && tournaments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <Text style={styles.title}>Torneos Disponibles</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {tournaments.length === 0 && !loading ? (
        <EmptyState icon="emoji-events" message="No hay torneos disponibles" />
      ) : (
        tournaments.map((tournament) => (
          <Card key={tournament.id} style={styles.card}>
            <Text style={styles.tournamentName}>{tournament.name}</Text>
            <Text style={styles.sport}>{tournament.sport}</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fechas:</Text>
              <Text style={styles.value}>{tournament.startDate} - {tournament.endDate}</Text>
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

            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: tournament.status === 'ACTIVE' ? COLORS.success : COLORS.secondary }]} />
              <Text style={styles.statusText}>{tournament.status}</Text>
            </View>
          </Card>
        ))
      )}
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
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
  },
  card: {
    marginBottom: SPACING.md,
  },
  tournamentName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sport: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
});

export default TournamentsList;
