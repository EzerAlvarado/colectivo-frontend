import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, ImageBackground, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");


  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("userId");
      if (storedUser) {
        navigation.navigate("Dashboard", { usuario: storedUser });
      }
    };
    loadUser();
  }, []);
  
  const handleLogin = async () => {
    //navigation.navigate("Dashboard")
    
    if (!correo.includes('@')) {
        alert("El correo debe ser válido");
        console.log("1")
        return;
    }
    if (contrasena.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        console.log("2")
        return;
    }
    console.log(contrasena)
    console.log(correo)
    try {
        const response = await fetch('https://solobackendintegradora.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena,
            })
        });
        console.log("6")
        const data = await response.json();
        if (data && data[0] && data[0][0] && data[0][0].id) {
          await AsyncStorage.setItem("userType", data[0][0].tipo.toString());
          const tipo = "admin"
          if (tipo == "admin") {
            await AsyncStorage.setItem("userId", data[0][0].id.toString());
            console.log("User id", data[0][0].id.toString())
          }
          const userType = await AsyncStorage.getItem("userType");
          if(tipo == "admin"){
            navigation.navigate("Dashboard");
          }
          if(tipo != "admin"){
            console.error(error);
            res.status(500).json({ error: "Error al modificar la empresa" });
          }
        } else {
          alert("Error en las credenciales");
          console.log("3")
        }
    } catch (error) {
      console.error("Error de conexión", error);
      alert("Error de conexión");
      console.log("4")
    }
};
  
  
  
  return (

    <ScrollView style={styles.container}>
      <ImageBackground
  style={styles.imagenfondo}
  source={require('../assets/c3.jpg')}
  blurRadius={5}>
</ImageBackground>
      <View style={styles.header}>
      </View>
      
      <View style={styles.loginContainer}>
        
        <Image
          source = {require('../assets/Logo Sin fondo.png')}
          style={styles.logo}
        />

        <Text style={styles.sectionTitle}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="corrreo"
          value={correo}
          onChangeText={setCorreo}
        />
        <Text style={styles.sectionTitle}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="contraseña"
          value={contrasena}
          onChangeText={setContrasena}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        
      </View>
      
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "auto",
    
  },
  imagenfondo: {
    flex: 1,  
    width: "100%",  
    height: "130%",  
    position: "absolute",  
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#266150",
    height: 40,
    
  },
  logo: {
    width: "25%",
    height: "25%",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
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
  loginContainer: {
    padding: 15,
    backgroundColor: "#f1f1ec",
    marginVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    width: "30%",
    height: "90%",
    marginTop: "8%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 40,
    marginLeft: "5%",
    marginRight: "5%"
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
    marginTop: "10%",
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    width: "30%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
    marginLeft: "5%",
    marginRight: "5%"
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
  menuItem: {
    fontSize: 14,
    marginTop: 5,
  },
  horarioItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  horarioText: {
    fontSize: 16,
  },
});

export default LoginScreen;
