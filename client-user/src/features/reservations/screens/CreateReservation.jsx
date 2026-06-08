// src/features/reservations/screens/CreateReservation.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useReservations } from '../hooks/useReservations.js';

const CreateReservation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { fieldId } = route.params || {};
  const { createReservation, loading } = useReservations();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: '',
      time: '',
      duration: '1',
    },
  });

  const onSubmit = async (data) => {
    const reservationData = {
      fieldId,
      date: data.date,
      time: data.time,
      duration: parseInt(data.duration, 10),
    };

    const result = await createReservation(reservationData);
    if (result.success) {
      Alert.alert(
        'Reserva Creada',
        'Tu reserva ha sido creada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Crear Reserva</Text>

        <Card>
          <Input
            label="Fecha"
            placeholder="YYYY-MM-DD"
            control={control}
            name="date"
            error={errors.date?.message}
            keyboardType="default"
          />
          <Input
            label="Hora"
            placeholder="HH:MM"
            control={control}
            name="time"
            error={errors.time?.message}
            keyboardType="default"
          />
          <Input
            label="Duración (horas)"
            placeholder="1"
            control={control}
            name="duration"
            error={errors.duration?.message}
            keyboardType="number-pad"
          />
          <Button
            title="Crear Reserva"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />
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
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default CreateReservation;
