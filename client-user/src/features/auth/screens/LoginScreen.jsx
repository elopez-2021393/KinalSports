// src/features/auth/screens/LoginScreen.jsx

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { handleLogin, loading, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await handleLogin(data.emailOrUsername, data.password);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/kinal_sports.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>KinalSports</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <View style={styles.form}>
        <Input
          label="Correo o usuario"
          placeholder="Ingresa tu correo o usuario"
          control={control}
          name="emailOrUsername"
          error={errors.emailOrUsername?.message}
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
        <Button
          title="Iniciar Sesión"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.button}
        />
      </View>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  form: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
  registerLink: {
    marginTop: SPACING.md,
  },
  registerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  registerTextBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
