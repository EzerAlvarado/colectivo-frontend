import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Dimensions, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuscripcionesScreen = ({navigation}) => {

  const [InfoEmpresasna, setEmpresas] = useState([]);
  const [userId, setUserId] = useState('');
  const [userType, setuserType] = useState('');

  const empresasFiltradas1 = InfoEmpresasna.filter(item => item.estado === 1);
  const empresasFiltradas = InfoEmpresasna.filter(item => item.estado === 0);

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
    const intervalo = setInterval(loadUserId, 10000);

    return () => clearInterval(intervalo);
  }, []);


  const handleAlta = async (id) => {
    const storedUserId = await AsyncStorage.getItem("userType");
    //console.log(id)
    //console.log("E ", userType, userId)
    try {
      const response = await fetch('http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/modificarestadoemp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            empresaid: id,
            nuevoestado: "1"
        })
      });
      const data = await response.json();
      if (data) {
        alert("Los cambios se relejaran en breve")
        setEmpresas((prevEmpresas) => prevEmpresas.filter((empresa) => empresa.id !== id))
      } else {
        console.error("La estructura de la respuesta no es la esperada.");
      }
    } catch (error) {
      console.error("Error al obtener la información ", error);
    }
  };



  const handleBaja = async (id) => {
    //console.log("baja 1")
    const storedUserId = await AsyncStorage.getItem("userType");
    //console.log(id)
    //console.log("E ", userType, userId)
    try {
      const response = await fetch('http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/modificarestadoemp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            empresaid: id,
            nuevoestado: "0"
        })
      });
      const data = await response.json();
      if (data) {
        setEmpresas((prevEmpresas) => prevEmpresas.filter((empresa) => empresa.id !== id))
      } else {
        console.error("La estructura de la respuesta no es la esperada.");
      }
    } catch (error) {
      console.error("Error al obtener la información ", error);
    }
  };


  useEffect(() => {
      const fetchInfoEmpresas = async () => {
        try {
          const response = await fetch(`http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/empresassuscripciones`);
          const data = await response.json();
          //console.log("Empresas Suscripciones:", data);
          if (data && data[0] && data[0][0]) {
            setEmpresas(data[0]);
          } else {
            console.error("La estructura de la respuesta no es la esperada.");9
          }
        } catch (error) {
          console.error("Error al obtener la información ", error);
        }
      };
  
      fetchInfoEmpresas();
      const intervalo = setInterval(fetchInfoEmpresas, 5000);
  
      return () => clearInterval(intervalo);
    
  }, [userId]);

  const cardWidth = Dimensions.get("window").width / 5 - 14;//modificarestadoemp
  
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
          <Text style={styles.title3}>StyleDate</Text>
        </View>

        <ScrollView style={styles.mainContent}>
        <Text style={styles.title2}>Empresas activas</Text>
        {empresasFiltradas1.length > 0 && (
        <>
        <FlatList
          data={empresasFiltradas1}
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          contentContainerStyle={styles.containercartas}
          renderItem={({ item }) => (
            <View style={[styles.cartas, { width: cardWidth }]}>
                <Text style={styles.title}>{item.nombre}</Text>
              <Text style={styles.text}>Suscripción: 

              {item.estado_suscripcion == 1 && (<Text> Suscrito</Text>)}
              {item.estado_suscripcion == 0 && (<Text> No Suscrito</Text>)}

          </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleBaja(item.id)} style={[styles.button, styles.buttonRechazar]}>
                  <Text style={styles.buttonText}>Dar de Baja</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </>
    )}
        <Text style={styles.title2}>Empresas no activas</Text>
        {empresasFiltradas.length > 0 && (
        <>
        <FlatList
          data={empresasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          contentContainerStyle={styles.containercartas}
          renderItem={({ item }) => (
            <View style={[styles.cartas, { width: cardWidth }]}>
              <Text style={styles.title}>{item.nombre}</Text>
              <Text style={styles.text}>Suscripción: 
                
              {item.estado_suscripcion == 1 && (<Text> Suscrito</Text>)}
              {item.estado_suscripcion == 0 && (<Text> No Suscrito</Text>)}

              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleAlta(item.id)} style={styles.button}>
                  <Text style={styles.buttonText}>Dar de Alta</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </>
    )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title3: {
    color: "#4a8070",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  containercartas: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
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
  Opciones: {
    color: "white",
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
  },
  menuItem1: {
    paddingVertical: 10,
    marginTop: "9%",
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
  title2: {
    color: "#a19f9d",
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    paddingLeft: 16,
  },
  containercartas: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  titleContainer: {
    backgroundColor: "#266150",
    padding: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 20,
    textAlign: "left",
    color: "Black",
  },
  cartas: {
    backgroundColor: "#f1f1ec",
    margin: 5,
    borderRadius: 3,
    alignItems: "left",
    justifyContent: "space-between",
    minHeight: 180,
  },
  text: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 5,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#266150",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    width: "37%",
    marginLeft: 20,
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

export default SuscripcionesScreen;
