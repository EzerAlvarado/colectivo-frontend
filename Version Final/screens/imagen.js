/*
import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const MostrarImagen = () => {
  const [imageUri, setImageUri] = useState(null);
  const imagenId = 1;

  useEffect(() => {
    const obtenerImagen = async () => {
      try {
        const response = await axios.get(`https://solobackendintegradora.onrender.com/imagene/14`);
        const base64Image = response.data.image;
        setImageUri(`data:image/jpeg;base64,${base64Image}`);
      } catch (error) {
        console.error('Error al obtener la imagen:', error);
        Alert.alert('Error', 'No se pudo cargar la imagen');
      }
    };

    obtenerImagen();
  }, [imagenId]);

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text>Cargando imagen...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default MostrarImagen;
*/