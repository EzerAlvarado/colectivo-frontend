import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = ({navigation}) => {

  const [InfoEmpresasa, setEmpresas] = useState({});
  const [userId, setUserId] = useState('');
  const [userType, setuserType] = useState('');

  useEffect(() => {
    const loadUserId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            const storedUserType = await AsyncStorage.getItem("admin");
            if (storedUserId) {
              setUserId(storedUserId);
            }
            if (storedUserType) {
              setuserType(storedUserType);
          }
        } catch (error) {
            console.error("Error obteniendo userId", error);
        }
    };

    loadUserId();
    const intervalo = setInterval(loadUserId, 3000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (userId && userType == "admin" ) {
      const fetchInfoEmpresasa = async () => {
        try {
          const response = await fetch(`https://solobackendintegradora.onrender.com/empresasactivadas`);
          const data = await response.json();
          //console.log("Citas recibidas:", data);
          
          if (Array.isArray(data) && Array.isArray(data[0])) {
            setEmpresas(data[0]);
          } else {
            console.error("La estructura de la respuesta no es la esperada.");
          }
        } catch (error) {
          console.error("Error al obtener la información ", error);
        }
      };
  
      fetchInfoEmpresasa();
      const intervalo = setInterval(fetchInfoEmpresasa, 3000);
  
      return () => clearInterval(intervalo);
    }
  }, [userId]);

  const lista = [
    { id: 1, suscripcion: "si", correo: "toño@gmail.com", nombre: "Barberia el Toño", Servicios: "Corte de Barba, Buzz Cut, Skin Fade, Pompadour", Direccion: "Av. Dos cuartos y 2" },
    { id: 2, suscripcion: "no", correo: "aña@gmail.com", nombre: "Uñas con Margaritas de Aña", Servicios: "Francesa clásica, Baby Boomer, Animal Print, Marble", Direccion: "Av. Nuevo Leon y 6" },
    { id: 3, suscripcion: "si", correo: "ninja@gmail.com", nombre: "Salon Pro Edicion 2", Servicios: "Fade, Shaggy Layers, Mohawk", Direccion: "Av. Monterrey y 4" },
    { id: 4, suscripcion: "si", correo: "3bodys@gmail.com", nombre: "Masajes los 3 cuerpos", Servicios: "Masaje Sueco, Masaje de Tejido Profundo, Masaje Miofascial, Masaje Linfático", Direccion: "Av. Obregon y 98" },
    { id: 5, suscripcion: "si", correo: "spa@gmail.com", nombre: "Spa Relax", Servicios: "Facial, Aromaterapia, Reflexología", Direccion: "Av. Reforma y 15" },
    { id: 6, suscripcion: "si", correo: "spa2@gmail.com", nombre: "SPA El Tiro", Servicios: "Masaje Relajante, Hidroterapia", Direccion: "Av. Central y 20" },
    { id: 7, suscripcion: "si", correo: "ana@gmail.com", nombre: "Ana's Nails", Servicios: "Uñas Esculpidas, Manicure Japonés", Direccion: "Av. Hidalgo y 10" },
    { id: 8, suscripcion: "si", correo: "nuclear@gmail.com", nombre: "Masajes Nucleares", Servicios: "Masaje Deportivo, Masaje Relajante", Direccion: "Av. Revolución y 25" },
    { id: 9, suscripcion: "si", correo: "toño2@gmail.com", nombre: "Peluquería el Toño", Servicios: "Cortes Clásicos y Modernos", Direccion: "Av. Morelos y 5" },
    { id: 10, suscripcion: "si", correo: "revivido@gmail.com", nombre: "SPA El Revivido", Servicios: "Hidratación Profunda, Baño de Vapor", Direccion: "Av. Independencia y 12" },
    { id: 10, suscripcion: "si", correo: "revivido@gmail.com", nombre: "SPA El Revivido", Servicios: "Hidratación Profunda, Baño de Vapor", Direccion: "Av. Independencia y 12" },
  ];

  const cardWidth = Dimensions.get("window").width / 5 - 14;

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleDashboard = () => {
    navigation.navigate("Dashboard")
  };

  const handleEmpresas = () => {
  navigation.navigate("Empresas")
  };

  const handleSuscripciones = () => {
    navigation.navigate("Suscripciones")
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      navigation.navigate("Login"); // Navegar al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleDashboard} style={styles.menuItem}>
            <Text style={styles.Opciones}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmpresas} style={styles.menuItem}>
            <Text style={styles.Opciones}>Empresas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSuscripciones} style={styles.menuItem}>
            <Text style={styles.Opciones}>Suscripciones</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <Text style={styles.Opciones}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.title1}>Dashboard</Text>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        contentContainerStyle={styles.containercartas}
        renderItem={({ item }) => (
          <View style={[styles.cartas, { width: cardWidth }]}>
            <Text style={styles.title}>{item.nombre}</Text>
            <Text style={styles.text}>Suscripción: {InfoEmpresasa.nombre}</Text>
            <Text style={styles.text}>Correo Electronico: {InfoEmpresasa.correo}</Text>
            <Text style={styles.text}>Direecion: {InfoEmpresasa.direccion}</Text>
            <Text style={styles.text}>Otros datos...</Text>
            <Text style={styles.text}>Otros datos...</Text>
            <Text style={styles.text}>Otros datos...</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "11%",
    height: "auto"
  },
  menuItem: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  Opciones: {
    color: "Black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fffdf9",
  },
  containercartas: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#266150",
    height: 40,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  title1: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  cartas: {
    padding: 15,
    backgroundColor: "#f1f1ec",
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 180, 
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#266150",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    width: "37%",
    marginLeft: 5,
  },
  buttonRechazar: {
    backgroundColor: "#b22222",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
