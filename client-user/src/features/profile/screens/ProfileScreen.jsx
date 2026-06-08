// src/features/profile/screens/ProfileScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useProfile } from '../hooks/useProfile.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

const ProfileScreen = () => {
  const { profile, loading, updateProfile } = useProfile();
  const logout = useAuthStore((state) => state.logout);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: '',
      phone: '',
      favoriteSports: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        favoriteSports: Array.isArray(profile.favoriteSports) 
          ? profile.favoriteSports.join(', ') 
          : (profile.favoriteSports || ''),
      });
    }
  }, [profile, reset]);

  const handleSave = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const getAvatarUri = () => {
    if (profile?.avatar && profile.avatar.startsWith('http')) {
      return profile.avatar;
    }
    return 'https://via.placeholder.com/150';
  };

  if (loading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: getAvatarUri() }}
              style={styles.avatar}
            />
            <Text style={styles.displayName}>{profile?.displayName || 'Usuario'}</Text>
          </View>

          {isEditing ? (
            <>
              <Input
                label="Nombre de Display"
                placeholder="Tu nombre"
                control={control}
                name="displayName"
                error={errors.displayName?.message}
              />
              <Input
                label="Teléfono"
                placeholder="+502 1234 5678"
                control={control}
                name="phone"
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
              <Input
                label="Deportes Favoritos"
                placeholder="Fútbol, Baloncesto, Tenis"
                control={control}
                name="favoriteSports"
                error={errors.favoriteSports?.message}
              />
              <View style={styles.buttonRow}>
                <Button
                  title="Cancelar"
                  onPress={() => setIsEditing(false)}
                  variant="secondary"
                  style={styles.button}
                />
                <Button
                  title="Guardar"
                  onPress={handleSubmit(handleSave)}
                  loading={loading}
                  style={styles.button}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{profile?.displayName || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{profile?.phone || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Deportes:</Text>
                <Text style={styles.value}>
                  {Array.isArray(profile?.favoriteSports) 
                    ? profile.favoriteSports.join(', ') 
                    : (profile?.favoriteSports || '-')}
                </Text>
              </View>
              <Button
                title="Editar Perfil"
                onPress={() => setIsEditing(true)}
                style={styles.button}
              />
            </>
          )}

          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="secondary"
            style={styles.logoutButton}
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
  },
  displayName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  button: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  logoutButton: {
    marginTop: SPACING.lg,
  },
});

export default ProfileScreen;
