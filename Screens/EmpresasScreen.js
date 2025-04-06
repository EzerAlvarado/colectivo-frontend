import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, FlatList, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from 'buffer';

const EmpresasScreen = ({navigation}) => {

  const [InfoEmpresasna, setEmpresas] = useState([]);
  const [InfoEmpresasnr, setEmpresas2] = useState([]);
  const [userId, setUserId] = useState('');
  const [userType, setuserType] = useState('');
  const [imageUri, setImageUri] = useState(null);



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

  //-----------------------------------------------------------
  //-----------------------------------------------------------
  //-----------------------------------------------------------
  //-----------------------------------------------------------

  useEffect(() => {
    const fetchInfoEmpresasR = async () => {
      //const storedUserId = await AsyncStorage.getItem("userType");
      //console.log("E ", userType, userId)
      try {
        const response = await fetch(`http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/empresasrechazadas`);
        const data2 = await response.json();
        console.log("E Empresas Rechazadas", data2);
        //console.log("E ",data[0])

        if (data2 && data2[0] && data2[0][0]) {
          setEmpresas2(data2[0]);
        } else {
          console.error("La estructura de la respuesta no es la esperada.");
        }
      } catch (error) {
        console.error("Error al obtener la información ", error);
      }
    };
    fetchInfoEmpresasR();
    const intervalo = setInterval(fetchInfoEmpresasR, 5000);

    return () => clearInterval(intervalo);
}, [userId]);


  useEffect(() => {
    const fetchInfoEmpresas = async () => {
    try {
        const response = await fetch(`http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/empresasnoadm`);
        const data = await response.json();
        
        console.log("Empresas Recibidas", data);
        if (data && data[0]) {
            const empresasConImagen = data[0].map(empresa => {
            if (empresa.imagen && empresa.imagen.data) {
                const bufferData = empresa.imagen.data;
                const base64String = Buffer.from(bufferData).toString('base64');
                const imageType = empresa.imagen.tipo || 'jpeg'; 
                empresa.imagenBase64 = `data:image/${imageType};base64,${base64String}`;
            
                console.log("Imagen Base64:", empresa.imagenBase64);

            } else {
                empresa.imagenBase64 = 'https://i.pinimg.com/originals/6c/bd/ee/6cbdee4d0050fff77ef812ea51a2ce4c.jpg';
            }
            return empresa;
            });
            console.log(empresasConImagen)
            setEmpresas(empresasConImagen);
        } else {
            console.error("La estructura de la respuesta no es la esperada.");
        }
        } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
        }
    };
    fetchInfoEmpresas();
    const intervalo = setInterval(fetchInfoEmpresas, 30000);
    return () => clearInterval(intervalo);
    }, []);

  const handleAceptar = async (id) => {
    const storedUserId = await AsyncStorage.getItem("userType");
    //console.log(id)
    //console.log("E ", userType, userId)
    try {
      const response = await fetch('http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/modificaradm', {
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
        setEmpresas((prevEmpresas) => prevEmpresas.filter((empresa) => empresa.id !== id))
      } else {
        console.error("La estructura de la respuesta no es la esperada.");
      }
    } catch (error) {
      console.error("Error al obtener la información ", error);
    }
  };

  const handleRechazar = async (id) => {
    const storedUserId = await AsyncStorage.getItem("userType");
    //console.log(id)
    //console.log("E ", userType, userId)
    try {
      const response = await fetch('http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/modificaradm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            empresaid: id,
            nuevoestado: "2"
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
          <Text style={styles.Opciones}>Admisión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSuscripciones} style={styles.menuItem}>
          <Text style={styles.Opciones}>Suscripciones</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItemcerrarsesion}>
          <Text style={styles.Opciones}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.title2}>StyleDate</Text>
        </View>

        <ScrollView style={styles.mainContent}>
          <Text style={styles.title1}>Lista de admisión</Text>
        <FlatList
          data={InfoEmpresasna}
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          contentContainerStyle={styles.containercartas}
          renderItem={({ item }) => (
            <View style={[styles.cartas, { width: cardWidth }]}>
            <Image
              source={{ uri: item.imagenBase64 }}
              style={{ width: "50%", height: 150, marginLeft: 10, marginTop: 10}}
            />
              <View style={styles.containertextos}>
                <Text style={styles.title}>{item.nombre}</Text>
                <Text style={styles.text}>Correo: <Text style={styles.text1}>{item.correo}</Text></Text>
                <Text style={styles.text}>Dirección: <Text style={styles.text1}>{item.direccion}</Text></Text>
                <Text style={styles.text}>Teléfono: <Text style={styles.text1}>{item.telefono}</Text></Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleAceptar(item.id)} style={styles.button}>
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRechazar(item.id)} style={styles.buttonRechazar}>
                  <Text style={styles.buttonText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
          </ScrollView>
      </View>
      </View>
);
};

const styles = StyleSheet.create({

  sidebar: {
    width: "12%",
    backgroundColor: "#1d5141",
    padding: 20,
    alignItems: "flex-start",
    height: "100%",
  },
  cartas: {
    backgroundColor: "#f1f1ec",
    margin: 5,
    borderRadius: 15,
    borderColor: "#b5b5b5",
    borderWidth: 2,
  },
  titleContainer: {
    backgroundColor: "#266150",
    padding: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "flex-start",
    paddingVertical: 10,
  },

  menuItemcerrarsesion: {
    paddingVertical: "360%",
  },
  
  title2: {
    color: "#4a8070",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fffdf9",
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
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    paddingLeft: 16,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  containerbuttons: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    padding: 10,
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
  button: {
    backgroundColor: "#266150",
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    width: "75%",
    height: 45,
    marginHorizontal: 5,  
  },
  buttonRechazar: {
    backgroundColor: "#949993",
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    width: "75%",
    height: 45,
    marginHorizontal: 5,  
  },
  buttonContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  containertextos: {
    marginBottom: 10,
    height: 200,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  cardImage: {
    padding: 20,
    width: "100%",
    height: 120,
    borderRadius: 5,
    marginRight: 10,
},
});

export default EmpresasScreen;
