// src/features/fields/screens/CreateReservation.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE } from '../../../shared/constants/theme.js';

const CreateReservation = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Reserva</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.text,
  },
});

export default CreateReservation;
