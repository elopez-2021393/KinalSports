// src/features/fields/screens/FieldsList.jsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { useFields } from '../hooks/useFields.js';

const FieldsList = () => {
  const navigation = useNavigation();
  const { fields, loading, error, refetch } = useFields();

  const handleFieldPress = (field) => {
    navigation.navigate('FieldDetail', { fieldId: field.id });
  };

  if (loading && fields.length === 0) {
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
      <Text style={styles.title}>Canchas Disponibles</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {fields.length === 0 && !loading ? (
        <EmptyState icon="sports-soccer" message="No hay canchas disponibles" />
      ) : (
        fields.map((field) => (
          <Card key={field.id} style={styles.card}>
            <Image
              source={{ uri: field.image || 'https://via.placeholder.com/300' }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.fieldName}>{field.name}</Text>
              <Text style={styles.location}>{field.location}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: field.isAvailable ? COLORS.success : COLORS.error }]} />
                <Text style={styles.statusText}>
                  {field.isAvailable ? 'Disponible' : 'No disponible'}
                </Text>
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
  fieldName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default FieldsList;
