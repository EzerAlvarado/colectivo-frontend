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
    if (!correo.includes('@')) {
        alert("El correo debe ser válido");
        return;
    }
    if (contrasena.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
    }
    try {
        const response = await fetch('http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/logins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena,
            })
        });

        const data = await response.json();
        console.log("Datos de la respuesta:", data); 

        if (data && data.id && data.tipo) {
            await AsyncStorage.setItem("userType", data.tipo.toString());
            await AsyncStorage.setItem("userId", data.id.toString());
            console.log("User id", data.id.toString());
            if (data.tipo === "admin") {
                navigation.navigate("Dashboard");
            } else {
                alert("No tienes permisos de administrador");
            }
        } else {
            alert("Error en las credenciales");
        }
    } catch (error) {
        console.error("Error de conexión", error);
        alert("Error de conexión");
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
          secureTextEntry={true}
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
