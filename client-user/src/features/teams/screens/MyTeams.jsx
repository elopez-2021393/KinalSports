// src/features/teams/screens/MyTeams.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useTeams } from '../hooks/useTeams.js';

const MyTeams = () => {
  const navigation = useNavigation();
  const { myTeams, loading, error, refetchMyTeams } = useTeams();

  const handleTeamPress = (team) => {
    navigation.navigate('TeamDetail', { teamId: team.id });
  };

  if (loading && myTeams.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetchMyTeams} />
      }
    >
      <Text style={styles.title}>Mis Equipos</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {myTeams.length === 0 && !loading ? (
        <EmptyState icon="groups" message="No perteneces a ningún equipo" />
      ) : (
        myTeams.map((team) => (
          <Card key={team.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image
                source={{ uri: team.image || 'https://via.placeholder.com/100' }}
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
                {team.isCaptain && (
                  <View style={styles.captainBadge}>
                    <Text style={styles.captainText}>Capitán</Text>
                  </View>
                )}
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
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  cardContent: {
    flex: 1,
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
    marginBottom: SPACING.xs,
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
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
  captainBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  captainText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default MyTeams;
