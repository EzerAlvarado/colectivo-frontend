import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";

const HomeLocalScreen = () => {
  const navigation = useNavigation();

  const [servicios, setServicios] = useState([
    { id: "1", 
      nombre: "Spa Pedicure", 
      duracion: "1 Hora", 
      precio: "Desde 40 DLS" 
    },
    { id: "2", 
      nombre: "Acrylic Nails", 
      duracion: "1 Hora", 
      precio: "Desde 60 DLS" 
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);


  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: "",
    duracion: "",
    precio: "",
  });

// Funcion para las imagenes selccionadas 
const selectImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Se requiere permiso para acceder a la galería.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
    setSelectedImage({ uri: result.assets[0].uri });
  }
  
};

  const handleChange = (key, value) => {
    setNuevoServicio({ ...nuevoServicio, [key]: value });
  };

  const agregarServicio = () => {
    if (!nuevoServicio.nombre || !nuevoServicio.duracion || !nuevoServicio.precio) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevo = {
      id: Math.random().toString(),
      ...nuevoServicio,
    };

    setServicios([...servicios, nuevo]);
    setNuevoServicio({ nombre: "", duracion: "", precio: "" });
  };

  const handleReservar = (servicio) => {
    navigation.navigate("Reserva", { servicio });
  };

  const handleEditar = (servicio) => {
    navigation.navigate("EditarServicio", { servicio });
  };

  const [fontsLoaded] = useFonts({
    Playfair: require("../assets/PlayfairDisplay-VariableFont_wght.ttf"),
  });
  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Estética Beautificiencia</Text>
        <Text style={styles.subtitle}>Anaheim CA</Text>

        <TouchableOpacity onPress={selectImage}>
          <Image
            source={
              selectedImage
                ? selectedImage
                : { uri: "https://i.pinimg.com/originals/6c/bd/ee/6cbdee4d0050fff77ef812ea51a2ce4c.jpg" }
            }
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.changeImageText}>Cambiar Imagen</Text>

        <View style={styles.services}>
          {servicios.map((servicio) => (
            <View key={servicio.id} style={styles.serviceCard}>
              <View>
                <Text style={styles.serviceTitle}>{servicio.nombre}</Text>
                <Text style={styles.serviceDuration}>{servicio.duracion}</Text>
                <Text style={styles.servicePrice}>{servicio.precio}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.reserveButton, { marginRight: 10 }]}
                  onPress={() => handleReservar(servicio)}
                >
                  <Text style={styles.reserveText}>RESERVAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditar(servicio)}
                >
                  <Text style={styles.editText}>EDITAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.addServiceTitle}>Agregar Nuevo Servicio</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del servicio"
          value={nuevoServicio.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Duración"
          value={nuevoServicio.duracion}
          onChangeText={(text) => handleChange("duracion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={nuevoServicio.precio}
          onChangeText={(text) => handleChange("precio", text)}
        />

        <TouchableOpacity style={styles.addButton} onPress={agregarServicio}>
          <Text style={styles.addButtonText}>Agregar Servicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f1f1ec",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
    marginTop: "5%",
    fontFamily: "Playfair",
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Playfair",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  changeImageText: {
    textAlign: "center",
    color: "#266150",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  services: {
    marginTop: 10,
  },
  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fdf8d5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#cbcbbe",
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  serviceDuration: {
    fontSize: 14,
    color: "#000",
    marginTop: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: "#000",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reserveButton: {
    backgroundColor: "#266150",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  reserveText: {
    color: "#fdf8d5",
    fontWeight: "bold",
    fontSize: 14,
  },
  editButton: {
    backgroundColor: "#FFA500",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  addServiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbcbbe",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#266150",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fdf8d5",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeLocalScreen;
