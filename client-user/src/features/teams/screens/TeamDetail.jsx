// src/features/teams/screens/TeamDetail.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { useTeams } from '../hooks/useTeams.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

const TeamDetail = () => {
  const route = useRoute();
  const { teamId } = route.params;
  const { teams, loading, joinTeam, leaveTeam } = useTeams();
  const user = useAuthStore((state) => state.user);

  const team = teams.find((t) => t.id === teamId);

  const handleJoin = async () => {
    const result = await joinTeam(teamId);
    if (result.success) {
      Alert.alert('Éxito', 'Te has unido al equipo');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLeave = async () => {
    Alert.alert(
      'Salir del Equipo',
      '¿Estás seguro de que deseas salir del equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            const result = await leaveTeam(teamId);
            if (result.success) {
              Alert.alert('Éxito', 'Has salido del equipo');
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Equipo no encontrado</Text>
      </View>
    );
  }

  const isMember = team.currentPlayers > 0;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: team.image || 'https://via.placeholder.com/400' }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Card>
          <Text style={styles.name}>{team.name}</Text>
          <Text style={styles.sport}>{team.sport}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Capacidad:</Text>
            <Text style={styles.value}>{team.maxPlayers} jugadores</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Jugadores actuales:</Text>
            <Text style={styles.value}>{team.currentPlayers}</Text>
          </View>

          {team.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.description}>{team.description}</Text>
            </View>
          )}

          {isMember ? (
            <Button
              title="Salir del Equipo"
              onPress={handleLeave}
              variant="secondary"
              style={styles.button}
            />
          ) : (
            <Button
              title="Unirse al Equipo"
              onPress={handleJoin}
              style={styles.button}
            />
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
  image: {
    width: '100%',
    height: 250,
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
  button: {
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default TeamDetail;
