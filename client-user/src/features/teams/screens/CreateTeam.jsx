// src/features/teams/screens/CreateTeam.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';
import { Card } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { useTeams } from '../hooks/useTeams.js';

const CreateTeam = () => {
  const navigation = useNavigation();
  const { createTeam, loading } = useTeams();
  const [image, setImage] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamName: '',
      sport: '',
      maxPlayers: '11',
      description: '',
    },
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('teamName', data.teamName);
    formData.append('sport', data.sport);
    formData.append('maxPlayers', parseInt(data.maxPlayers, 10));
    formData.append('description', data.description);

    if (image) {
      formData.append('photo', {
        uri: image.uri,
        name: 'team-photo.jpg',
        type: 'image/jpeg',
      });
    }

    const result = await createTeam(formData);
    if (result.success) {
      Alert.alert(
        'Equipo Creado',
        'Tu equipo ha sido creado exitosamente',
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
        <Text style={styles.title}>Crear Equipo</Text>

        <Card>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Seleccionar Foto</Text>
              </View>
            )}
          </TouchableOpacity>

          <Input
            label="Nombre del Equipo"
            placeholder="Ingresa el nombre del equipo"
            control={control}
            name="teamName"
            error={errors.teamName?.message}
          />
          <Input
            label="Deporte"
            placeholder="Ej: Fútbol, Baloncesto"
            control={control}
            name="sport"
            error={errors.sport?.message}
          />
          <Input
            label="Máximo de Jugadores"
            placeholder="11"
            control={control}
            name="maxPlayers"
            error={errors.maxPlayers?.message}
            keyboardType="number-pad"
          />
          <Input
            label="Descripción"
            placeholder="Descripción del equipo"
            control={control}
            name="description"
            error={errors.description?.message}
            multiline
          />
          <Button
            title="Crear Equipo"
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
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default CreateTeam;
