import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeLocalScreen = () => {
  const navigation = useNavigation();
  const [InfoEmpresa, setInfoEmpresa] = useState({});
  const [ServiciosEmpresa, setServiciosEmpresa] = useState([]);

  useEffect(() => {
    const fetchInfoEmpresa = async () => {
      try {
        const storedEmpresaId = await AsyncStorage.getItem("empresaId");
        console.log(storedEmpresaId)
        if(storedEmpresaId){
        const response = await fetch(`https://solobackendintegradora.onrender.com/empresas/${storedEmpresaId}`);//cambiar
        const data = await response.json();
          if (data && data[0] && data[0]) {
            setInfoEmpresa(data[0][0]);
            console.log(data)
          } else {
            console.error("Problema con los servicios de la empresa");
          }
        }
          } catch (error) {
            console.error("Error al obtener la información de la empresa", error);
          }
        };
          fetchInfoEmpresa();
          const intervalo = setInterval(fetchInfoEmpresa, 20000);
          return () => clearInterval(intervalo);
}, []);

  useEffect(() => {
      const fetchServiciosEmpresa = async () => {
        try {
          const storedEmpresaId = await AsyncStorage.getItem("empresaId");
          console.log(storedEmpresaId)
          if(storedEmpresaId){
          const response = await fetch(`https://solobackendintegradora.onrender.com/servicios/empresa/${storedEmpresaId}`);//cambiar
          const data = await response.json();
            if (data && data[0] && data[0]) {
              setServiciosEmpresa(data[0]);
              console.log(data)
            } else {
              console.error("Problema con los servicios de la empresa");
            }
          }
            } catch (error) {
              console.error("Error al obtener la información de la empresa", error);
            }
          };
          fetchServiciosEmpresa();
            const intervalo = setInterval(fetchServiciosEmpresa, 20000);
            return () => clearInterval(intervalo);
}, []);

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
  
  const nuevo = {
    id: Math.random().toString(),
    ...nuevoServicio,
  };
  const handleChange = (key, value) => {
    setNuevoServicio({ ...nuevo, [key]: value });
  };

  const agregarServicio = async () => {
    if (!nuevoServicio.nombre || !nuevoServicio.duracion || !nuevoServicio.precio) {
      alert("Por favor, completa todos los campos.");// nuevo servicio contiene la info del nuevo servicio y nuevo no se que hace
      return;
      }
      try {
        const storedEmpresaId = await AsyncStorage.getItem("empresaId");
        console.log("Empresa: ", storedEmpresaId, "Nombre: ", nuevoServicio.nombre, "Descripcion: ", "Precio: ", nuevoServicio.precio, "Duracion: ", nuevoServicio.duracion)
        const response = await fetch(`https://solobackendintegradora.onrender.com/servicios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'// empresa, nombre, descripcion, precio -duracion
          },
          body: JSON.stringify({
            empresa: storedEmpresaId,
            nombre: nuevoServicio.nombre,
            descripcion: "",
            precio: parseFloat(nuevoServicio.precio),
            duracion: nuevoServicio.duracion
            })
          });
            const result = await response.json();
            console.log(result)
            console.log("Añadido")
            console.log("Empresa:", storedEmpresaId, "Nombre:", nuevoServicio.nombre, "Descripcion:", "nada por el momento", "Precio:", nuevoServicio.precio, "Duracion:", nuevoServicio.duracion)
            Alert.alert("Servicio actualizado", `Duración: ${nuevoServicio.duracion}\nPrecio: ${nuevoServicio.precio}`);
            //navigation.goBack();
            } catch (error) {
              console.error("Error al crear el servicio", error);
            }

    setServiciosEmpresa([...ServiciosEmpresa, nuevoServicio]);
    setNuevoServicio({ nombre: "", duracion: "", precio: "" });
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
        <Text style={styles.title}>{InfoEmpresa.nombre}</Text>
        <Text style={styles.subtitle}>{InfoEmpresa.direccion}</Text>

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
          {ServiciosEmpresa.map((servicio) => (
            <View key={servicio.id} style={styles.serviceCard}>
              <View>
                <Text style={styles.serviceTitle}>{servicio.nombre}</Text>
                <Text style={styles.serviceDuration}>{servicio.duracion}</Text>
                <Text style={styles.servicePrice}>{servicio.precio}</Text>
              </View>
              <View style={styles.buttonsContainer}>
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
