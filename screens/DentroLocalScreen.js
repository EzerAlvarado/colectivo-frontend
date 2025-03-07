import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SalonScreen = ({ route }) => {
    const navigation = useNavigation();
    const [InfoEmpresa, setInfoEmpresa] = useState({});
    const [ServiciosEmpresa, setServiciosEmpresa] = useState([]);
    const { id } = route.params;
    console.log(id)

        useEffect(() => {
            if (id) {
                const fetchInfoEmpresa = async () => {
                    try {
                        const response = await fetch(`https://solobackendintegradora.onrender.com/empresas/${id}`);
                        const data = await response.json();
                        if (data && data[0] && data[0][0]) {
                            setInfoEmpresa(data[0][0]);
                            console.log(data)
                        } else {
                            console.error("Problema con la información de la empresa");
                        }
                    } catch (error) {
                        console.error("Error al obtener la información de la empresa", error);
                    }
                    try {
                        const response = await fetch(`https://solobackendintegradora.onrender.com/servicios/empresa/${id}`);
                        const data2 = await response.json();
                        if (data2 && data2[0] && data2[0]) {
                            setServiciosEmpresa(data2[0]);
                            console.log(data2[0])
                        } else {
                            console.error("Problema con la información de los servicios");
                        }
                    } catch (error) {
                        console.error("Error al obtener la información de los servicios", error);
                    }
                };
    
                fetchInfoEmpresa();
                const intervalo = setInterval(fetchInfoEmpresa, 20000);
    
                return () => clearInterval(intervalo);
            }
        }, []);

    const handleReservar = (servicio) => {
        // Navegar a la pantalla de reserva, pasando la información del servicio
        AsyncStorage.getItem("userId").then((storedUserId) => {
            console.log(storedUserId);
            if(storedUserId){
                navigation.navigate("Reserva", {
                    servicio: servicio,
                });
            } else
            {
                Alert.alert("Ocupas registrarte para hacer citas")
            }
        });
    };

//Fuentes Personalizadas
const [fontsLoaded] = useFonts({
    Playfair: require('../assets/PlayfairDisplay-VariableFont_wght.ttf'),
});
    return (        
        <View style={styles.container}>
            <Text style={styles.title}>{InfoEmpresa.nombre}</Text>
            <Text style={styles.subtitle}>{InfoEmpresa.direccion}</Text>

            <Image
                source={{
                    uri: "https://i.pinimg.com/originals/6c/bd/ee/6cbdee4d0050fff77ef812ea51a2ce4c.jpg",
                }}
                style={styles.image}
            />

            <View style={styles.services}>
                {ServiciosEmpresa.map((servicio) => (
                    <View key={servicio.id} style={styles.serviceCard}>
                        <View>
                            <Text style={styles.serviceTitle}>{servicio.nombre}</Text>
                            <Text style={styles.serviceDuration}>{servicio.duracion}</Text>
                            <Text style={styles.servicePrice}>{servicio.precio}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.reserveButton}
                            onPress={() => handleReservar(servicio)} // Pasar el servicio seleccionado
                        >
                            <Text style={styles.reserveText}>RESERVAR</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1f1ec",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        marginBottom: 5,
        marginTop: "5%",
        fontFamily: "Playfair"
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#000",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "Playfair"
    },
    services: {
        marginTop: 10,
    },
    serviceCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fdf8d5",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#cbcbbe"
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
});

export default SalonScreen;
