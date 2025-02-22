import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, FlatList, Dimensions } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmpresasScreen = ({navigation}) => {

  const [InfoEmpresasna, setEmpresas] = useState({});
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
      const fetchInfoEmpresas = async () => {
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
  
      fetchInfoEmpresas();
      const intervalo = setInterval(fetchInfoEmpresas, 3000);
  
      return () => clearInterval(intervalo);
    }
  }, [userId]);


  const lista = [
    { id: 1, correo: "toño@gmail.com", nombre: "Barberia el Toño", Servicios: "Corte de Barba, Buzz Cut, Skin Fade, Pompadour", Direecion: "Av. Dos cuartos y 2" },
    { id: 2, correo: "aña@gmail.com", nombre: "Uñas con Margaritas de Aña", Servicios: "Francesa clásica, Baby Boomer, Animal Print, Marble", Direecion: "Av. Nuevo Leon y 6" },
    { id: 3, correo: "ninja@gmail.com", nombre: "Salon Pro Edicion 2", Servicios: "Fade, Shaggy Layers, Mohawk", Direecion: "Av. Monterrey y 4" },
    { id: 4, correo: "3bodys@gmail.com", nombre: "Masajes los 3 cuerpos", Servicios: "Masaje Sueco, Masaje de Tejido Profundo, Masaje Miofascial, Masaje Linfático", Direecion: "Av. Obregon y 98" },
  ];

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
        </View>
      )}
      
      <View >
      <Text style={styles.title1}>Lista de admicion</Text>
        {lista.map((item) => (
          <View key={item.id} style={styles.cartas}>
            <Text style={styles.title}>{InfoEmpresasna.nombre}</Text>
            <Text style={styles.text}>Correo Electronico: {InfoEmpresasna.correo}</Text>
            <Text style={styles.text}>Direecion: {InfoEmpresasna.direccion}</Text>
            <Text style={styles.text}>Otros datos...</Text>
            <View style={styles.containercartas}>
                <TouchableOpacity onPress={""} style={styles.button}>
                    <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={""} style={styles.button}>
                    <Text style={styles.buttonText}>Rechazar</Text>
                </TouchableOpacity>
                </View>
          </View>
        ))}
      </View>
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
    backgroundColor: "#cbcbbe",
  },
  containercartas: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#266150",
    height: 40,
    paddingLeft: 10,
  },
  logo: {
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: '30px'
  },
  title1: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: '30px'
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  cartas: {
    padding: 15,
    backgroundColor: "#f1f1ec",
    marginVertical: 10,
    borderRadius: 10,
    alignSelf: "d",
    width: "50%",
    height: "auto",
    marginTop: "3%",
    alignSelf: "center"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 5,
  },
  datePickerText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#266150",
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "150px",
    marginLeft: "20%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  menuSection: {
    fontFamily: "Open Sans",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
});

export default EmpresasScreen;
