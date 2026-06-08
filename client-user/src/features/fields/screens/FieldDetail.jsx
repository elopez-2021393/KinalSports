// src/features/fields/screens/FieldDetail.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { useFields } from '../hooks/useFields.js';

const FieldDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { fieldId } = route.params;
  const { fields, loading } = useFields();

  const field = fields.find((f) => f.id === fieldId);

  const handleReserve = () => {
    navigation.navigate('CreateReservation', { fieldId });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!field) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Cancha no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: field.image || 'https://via.placeholder.com/400' }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Card>
          <Text style={styles.name}>{field.name}</Text>
          <Text style={styles.location}>{field.location}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{field.fieldType}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Capacidad:</Text>
            <Text style={styles.value}>{field.capacity} personas</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Precio:</Text>
            <Text style={styles.value}>Q{field.price}/hora</Text>
          </View>

          {field.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.description}>{field.description}</Text>
            </View>
          )}

          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: field.isAvailable ? COLORS.success : COLORS.error }]} />
            <Text style={styles.statusText}>
              {field.isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
          </View>

          {field.isAvailable && (
            <Button
              title="Reservar Cancha"
              onPress={handleReserve}
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
  location: {
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
  button: {
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default FieldDetail;
