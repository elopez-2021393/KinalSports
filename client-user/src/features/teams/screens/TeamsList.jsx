// src/features/teams/screens/TeamsList.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useTeams } from '../hooks/useTeams.js';

const TeamsList = () => {
  const navigation = useNavigation();
  const { teams, loading, error, refetch } = useTeams();

  const handleTeamPress = (team) => {
    navigation.navigate('TeamDetail', { teamId: team.id });
  };

  if (loading && teams.length === 0) {
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
      <Text style={styles.title}>Equipos Disponibles</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {teams.length === 0 && !loading ? (
        <EmptyState icon="groups" message="No hay equipos disponibles" />
      ) : (
        teams.map((team) => (
          <Card key={team.id} style={styles.card}>
            <Image
              source={{ uri: team.image || 'https://via.placeholder.com/300' }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.sport}>{team.sport}</Text>
              <View style={styles.playersContainer}>
                <Text style={styles.label}>Jugadores:</Text>
                <Text style={styles.value}>{team.currentPlayers}/{team.maxPlayers}</Text>
              </View>
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
    overflow: 'hidden',
    padding: 0,
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: SPACING.md,
  },
  teamName: {
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
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginRight: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default TeamsList;
