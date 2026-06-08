// src/features/auth/screens/RegisterScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { handleRegister, loading, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await handleRegister(data);
    if (result.success) {
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>

      <View style={styles.form}>
        <Input
          label="Nombre"
          placeholder="Ingresa tu nombre"
          control={control}
          name="name"
          error={errors.name?.message}
        />
        <Input
          label="Apellido"
          placeholder="Ingresa tu apellido"
          control={control}
          name="surname"
          error={errors.surname?.message}
        />
        <Input
          label="Usuario"
          placeholder="Ingresa tu nombre de usuario"
          control={control}
          name="username"
          error={errors.username?.message}
        />
        <Input
          label="Correo electrónico"
          placeholder="Ingresa tu correo"
          control={control}
          name="email"
          error={errors.email?.message}
          keyboardType="email-address"
        />
        <Input
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          control={control}
          name="password"
          error={errors.password?.message}
          secureTextEntry
        />
        <Input
          label="Teléfono"
          placeholder="Ingresa tu teléfono"
          control={control}
          name="phone"
          error={errors.phone?.message}
          keyboardType="phone-pad"
        />
        <Button
          title="Registrarse"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default RegisterScreen;
