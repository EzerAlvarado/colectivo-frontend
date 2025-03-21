import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import ImageResizer from 'react-native-image-resizer';
import * as ImageManipulator from 'expo-image-manipulator';

const HomeLocalScreen = () => {
  const navigation = useNavigation();
  const [InfoEmpresa, setInfoEmpresa] = useState({});
  const [ServiciosEmpresa, setServiciosEmpresa] = useState([]);
  const [imageBase64, setImageBase64] = useState(null);

  const [imageUri, setImageUri] = useState(null);


  useEffect(() => {
    const obtenerImagen = async () => {
      try {
        const storedEmpresaId = await AsyncStorage.getItem("empresaId");
        if(storedEmpresaId){
        const response = await axios.get(`https://solobackendintegradora.onrender.com/imagene/${storedEmpresaId}`);
        const base64Image = response.data.image;
        //console.log(response.data.image)
        setImageUri(`data:image/jpeg;base64,${base64Image}`);
          }
          } catch (error) {
            //console.error("Error al obtener la imagen de la empresa", error);
          }
      }
    obtenerImagen();
  }, []);


  useEffect(() => {
    const fetchInfoEmpresa = async () => {
      try {
        const storedEmpresaId = await AsyncStorage.getItem("empresaId");
        console.log(storedEmpresaId)
        if(storedEmpresaId){
        const response = await fetch(`https://solobackendintegradora.onrender.com/empresas/${storedEmpresaId}`);
        const data = await response.json();
          if (data && data[0] && data[0]) {
            setInfoEmpresa(data[0][0]);
          } else {
            console.error("Problema con la empresa");
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
          if(storedEmpresaId){
          const response = await fetch(`https://solobackendintegradora.onrender.com/servicios/empresa/${storedEmpresaId}`);//cambiar
          const data = await response.json();
            if (data && data[0] && data[0]) {
              setServiciosEmpresa(data[0]);
            } else {
              console.error("Problema con los servicios de la empresa");
            }
          }
            } catch (error) {
              console.error("Error al obtener la información de la empresa", error);
            }
          };
          fetchServiciosEmpresa();
            const intervalo = setInterval(fetchServiciosEmpresa, 5000);
            return () => clearInterval(intervalo);
}, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: "",
    duracion: "",
    precio: "",
  });

//-------------------------------------------------------------------------------------------------------------------------

const [uploadedImageId, setUploadedImageId] = useState(null);


const selectImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (result.canceled) {
    Alert.alert("Selección de imagen cancelada");
    return;
  }

  const uri = result.assets[0].uri;
  let resizedImage;
  try {
    resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800, height: 800 } }],
      { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
    );
  } catch (error) {
    console.error("Error al redimensionar la imagen:", error);
    Alert.alert("Error al seleecionar la imagen");
    return;
  }
  let base64;
  try {
    base64 = await FileSystem.readAsStringAsync(resizedImage.uri, { encoding: FileSystem.EncodingType.Base64 });
  } catch (error) {
    console.error("Error al convertir la imagen");
    return;
  }

  setImageUri(resizedImage.uri);
  uploadImage(base64);
};

const uploadImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('image', imageUri);
  const storedEmpresaId = await AsyncStorage.getItem("empresaId");
  console.log(storedEmpresaId)
  try {
    const response = await axios.post(`https://solobackendintegradora.onrender.com/uploade/${storedEmpresaId}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Respuesta del servidor:", response.data.message);
    alert("Imagen subida con éxito");
    setUploadedImageId(response.data.id);
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    alert("Error al subir la imagen");
  }
};




//-------------------------------------------------------------------------------------------------------------------------

  const nuevo = {
    id: Math.random().toString(),
    ...nuevoServicio,
  };
  const handleChange = (key, value) => {
    setNuevoServicio({ ...nuevo, [key]: value });
  };

  const agregarServicio = async () => {
    if (!nuevoServicio.nombre || !nuevoServicio.duracion || !nuevoServicio.precio) {
      alert("Por favor, completa todos los campos.");
      return;
      }
      try {
        const storedEmpresaId = await AsyncStorage.getItem("empresaId");

        const response = await fetch(`https://solobackendintegradora.onrender.com/servicios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
            Alert.alert("Servicio actualizado", `Duración: ${nuevoServicio.duracion}\nPrecio: ${nuevoServicio.precio}`);
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
          source={{ uri: imageUri ? imageUri : "https://i.pinimg.com/originals/6c/bd/ee/6cbdee4d0050fff77ef812ea51a2ce4c.jpg" }}
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
    borderColor: "#cbcbbe",
    borderWidth: 2
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
    marginTop: "5%",
    fontFamily: "Poppins"
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PoppinsTexto"
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
    backgroundColor: "#e0cdb6",
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
    backgroundColor: "#266150",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  elimnarButton: {
    backgroundColor: "#266150",
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
    fontFamily: "Poppins"
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
