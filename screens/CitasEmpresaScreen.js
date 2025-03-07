import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CitasEmpresaScreen = () => {
  const [empresaCitas, setEmpresaCitas] = useState([])

  const [empresaId, setempresaId] = useState('');
    useEffect(() => {
      const loadempresaId = async () => {
        try {
          const storedempresaId = await AsyncStorage.getItem("empresaId");
          if (storedempresaId) {
            setempresaId(storedempresaId);
          }
          } catch (error) {
            console.error("Error obteniendo empresaId", error);
        }
      };
      loadempresaId();
      const intervalo = setInterval(loadempresaId, 3000);
      return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (empresaId) {
      const fetchInfoCitasEmpresa = async () => {
        try {
          const response = await fetch(`https://solobackendintegradora.onrender.com/citas/empresa/${empresaId}`);
          const data = await response.json();
          //console.log("Citas recibidas:", data);
          if (data && data[0] && data[0]) {
            setEmpresaCitas(data[0]);
          } else {
            console.error("La estructura de la respuesta no es la esperada1.");
          }
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
        }
      };
      fetchInfoCitasEmpresa();
      const intervalo = setInterval(fetchInfoCitasEmpresa, 3000);
      return () => clearInterval(intervalo);
    }
  }, [empresaId]);


  const cancelarCita = (id) => {
    Alert.alert(
      "Cancelar Cita",
      "¿Estás seguro de que deseas cancelar esta cita?",
      [
      { text: "No", style: "cancel" },
      {
        text: "Sí",
        onPress: async () => {
          try {
            const response = await fetch(`https://solobackendintegradora.onrender.com/citas/${id}/cancelar`, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.text(); 
            console.log("Respuesta del servidor:", data)
            if (data) {
              setEmpresaCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
            } else {
              console.error("La estructura de la respuesta no es la esperada2.");
            }
          } catch (error) {
            console.error("Error al cancelar la cita:", error);
          }
        },
      },
    ]
  );
  };

  const [fontsLoaded] = useFonts({
    Playfair: require("../assets/PlayfairDisplay-VariableFont_wght.ttf"),
    Raleway: require("../assets/Raleway-VariableFont_wght.ttf"),
  });

  const renderCitas = (citas) => (
    <ScrollView>
      {citas.length > 0 ? (
        citas.map((cita) => (
          <View key={cita.id} style={styles.card}>
            <Text style={styles.serviceTitle}>{cita.servicio}</Text>
            <Text style={styles.serviceDetails}>Cliente: {cita.usuario}</Text>
            <Text style={styles.serviceDetails}>Contacto: {cita.u_correo}</Text>
            <Text style={styles.serviceDetails}>Fecha: {cita.fecha}</Text>
            <Text style={styles.serviceDetails}>Hora: {cita.hora}</Text>
            <Text style={styles.serviceDetails}>Precio: {cita.precio}</Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => cancelarCita(cita.id)}
            >
              <Text style={styles.cancelButtonText}>Cancelar Cita</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.card}>
          <Text style={styles.message}>No tienes citas programadas.</Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citas Programadas</Text>
      {renderCitas(empresaCitas)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1ec",
    padding: 20,
    borderColor: "#cbcbbe",
    borderWidth: 2
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#033d3e",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Playfair",
    marginTop: "5%",
  },
  card: {
    backgroundColor: "#fdf8d5",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#033d3e",
    marginBottom: 10,
    fontFamily: "Raleway",
  },
  serviceDetails: {
    fontSize: 16,
    color: "#033d3e",
    marginBottom: 5,
    fontFamily: "Raleway",
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "#c94c4c",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#033d3e",
    textAlign: "center",
  },
});

export default CitasEmpresaScreen;