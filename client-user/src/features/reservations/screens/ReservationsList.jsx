// src/features/reservations/screens/ReservationsList.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { useReservations } from '../hooks/useReservations.js';

const ReservationsList = () => {
  const { reservations, loading, error, refetch, cancelReservation } = useReservations();

  const handleCancel = (id) => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que deseas cancelar esta reserva?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelReservation(id);
            if (result.success) {
              Alert.alert('Éxito', 'Reserva cancelada correctamente');
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return COLORS.success;
      case 'PENDING':
        return COLORS.warning;
      case 'CANCELLED':
        return COLORS.error;
      default:
        return COLORS.textLight;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading && reservations.length === 0) {
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
      <Text style={styles.title}>Mis Reservas</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {reservations.length === 0 && !loading ? (
        <EmptyState icon="event" message="No tienes reservas" />
      ) : (
        reservations.map((reservation) => (
          <Card key={reservation.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.fieldName}>{reservation.field.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.normalizedStatus) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(reservation.normalizedStatus) }]}>
                  {getStatusText(reservation.normalizedStatus)}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>{reservation.date}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Hora:</Text>
              <Text style={styles.value}>{reservation.time}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Duración:</Text>
              <Text style={styles.value}>{reservation.duration} horas</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Total:</Text>
              <Text style={styles.value}>Q{reservation.totalPrice}</Text>
            </View>

            {reservation.normalizedStatus === 'PENDING' && (
              <Button
                title="Cancelar Reserva"
                onPress={() => handleCancel(reservation.id)}
                variant="secondary"
                style={styles.cancelButton}
              />
            )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  fieldName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
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
  cancelButton: {
    marginTop: SPACING.md,
  },
});

export default ReservationsList;
