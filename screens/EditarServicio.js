import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditarServicio = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { servicio } = route.params;

  const [nombre, setNombre] = useState(servicio.nombre);
  const [duracion, setDuracion] = useState(servicio.duracion);
  const [precio, setPrecio] = useState(servicio.precio);
  const [idservicio] = useState(servicio.id);

  const handleSave = async () => {
    try {
      const storedEmpresaId = await AsyncStorage.getItem("empresaId");

      const response = await fetch(`http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/servicios/${idservicio}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empresa: storedEmpresaId,
          nombre: nombre, 
          descripcion: servicio.id,
          precio: precio,
          duracion: duracion,
        }),
      });

      const result = await response.json();
      //console.log(result);
      Alert.alert("Servicio actualizado", `Nombre: ${nombre}\nDuración: ${duracion}\nPrecio: ${precio}`);
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el servicio", error);
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar servicio", "¿Estás seguro de que deseas eliminar este servicio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          Alert.alert("Servicio eliminado");
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Servicio</Text>

      <Text style={styles.label}>Nombre del Servicio:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese el nombre del servicio"
      />

      <Text style={styles.label}>Duración:</Text>
      <TextInput style={styles.input} value={duracion} onChangeText={setDuracion} placeholder="Ingrese la duración" />

      <Text style={styles.label}>Precio:</Text>
      <TextInput style={styles.input} value={precio} onChangeText={setPrecio} placeholder="Ingrese el precio" />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Eliminar Servicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f1ec",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbcbbe",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#266150",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#266150",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditarServicio;
