import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = ({navigation}) => {

  const [InfoEmpresasa, setEmpresas] = useState({});
  const [userId, setUserId] = useState('');
  const [userType, setuserType] = useState('');

  useEffect(() => {
    const loadUserId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            //const storedUserType = await AsyncStorage.getItem("userType");//Esto es necesario?
            const storedUserType = "admin"
            if (storedUserId) {
              setUserId(storedUserId);
              console.log("userid:",storedUserId)
            }
            if (storedUserType == "admin") {
              setuserType(storedUserType);
              console.log("usertype: ",storedUserType)
          }
        } catch (error) {
            console.error("Error obteniendo userId", error);
        }
    };

    loadUserId();
    const intervalo = setInterval(loadUserId, 30000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {

    if (userId && userType == "admin" ) {
      const fetchInfoEmpresasa = async () => {
        try {
          const response = await fetch(`https://solobackendintegradora.onrender.com/empresasactivadas`);
          const data = await response.json();
          console.log("D Empresas activas", data);
          console.log("D ",data[0])
          
          if (data && data[0] && data[0][0]) {
            setEmpresas(data[0]);
          } else {
            console.error("La estructura de la respuesta no es la esperada.");
          }
        } catch (error) {
          console.error("Error al obtener la información ", error);
        }
      };
      fetchInfoEmpresasa();
      const intervalo = setInterval(fetchInfoEmpresasa, 5000);
      return () => clearInterval(intervalo);
    }
  }, [userId]);

  const cardWidth = Dimensions.get("window").width / 5 - 14;

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
      navigation.navigate("Login"); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity onPress={handleDashboard} style={styles.menuItem1}>
          <Text style={styles.Opciones}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEmpresas} style={styles.menuItem}>
          <Text style={styles.Opciones}>Empresas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSuscripciones} style={styles.menuItem}>
          <Text style={styles.Opciones}>Suscripciones</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Text style={styles.Opciones}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.title1}>Dashboard</Text>
        </View>

        <ScrollView style={styles.mainContent}>
          <FlatList
            data={InfoEmpresasa}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            contentContainerStyle={styles.containercartas}
            renderItem={({ item }) => (
              <View style={[styles.cartas, { width: cardWidth }]}> 
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.nombre}</Text>
                </View>
                <Text style={styles.text}>Correo: <Text style={styles.text1}>{item.correo}</Text></Text>
                <Text style={styles.text}>Dirección: <Text style={styles.text1}>{item.direccion}</Text></Text>
                <Text style={styles.text}>Teléfono: <Text style={styles.text1}>{item.telefono}</Text></Text>
                <Text style={styles.text}><Text style={styles.text1}></Text></Text>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fffdf9",
  },
  sidebar: {
    width: "12%",
    backgroundColor: "#266150",
    padding: 20,
    alignItems: "flex-start",
    height: "100%",
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItem1: {
    paddingVertical: 10,
    marginTop: "9%",
  },
  Opciones: {
    color: "white",
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: "#266150",
    justifyContent: "center",
    paddingLeft: 20,
  },
  title1: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  containercartas: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  cartas: {
    backgroundColor: "#f1f1ec",
    margin: 5,
    borderRadius: 3,
  },
  titleContainer: {
    backgroundColor: "#266150",
    padding: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    width: "100%",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 5,
    paddingLeft: 10,
  },
  text1: {
    fontSize: 18,
    textAlign: "left",
    marginVertical: 5,
    fontWeight: "normal",
  },
});


export default DashboardScreen;