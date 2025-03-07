import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

const HomeScreen = () => {
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        Playfair: require('../assets/PlayfairDisplay-VariableFont_wght.ttf'),
        Raleway: require('../assets/Raleway-VariableFont_wght.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#266150" />
            </View>
        );
    }

    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const fetchInfoEmpresas = async () => {
            try {
            const response = await fetch(`https://solobackendintegradora.onrender.com/empresas`);
            const data = await response.json();
            console.log("Empresas Recibidas", data);
            if (data && data[0]) {
                setEmpresas(data[0]);
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
    },[]);
    
    const funcionbienfuncional = (id) => {
        navigation.navigate("Local", {
            id,
        })
    }

    //----------------------------------------------------------------

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Bienvenido a StyleDate!</Text>
            <Text style={styles.TituloLocales}>Reserva tus servicios de belleza.</Text>
            <View style={styles.localesContainer}>
                {empresas.map((empresa) => (
                    <TouchableOpacity 
                        key={empresa.id} 
                        style={styles.card}
                        onPress={() => funcionbienfuncional(empresa.id)}
                        activeOpacity={0.7}
                    >
                        <Image source={{ uri: "https://i.pinimg.com/originals/6c/bd/ee/6cbdee4d0050fff77ef812ea51a2ce4c.jpg" }} style={styles.cardImage} />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{empresa.nombre}</Text>
                            <Text style={styles.cardLocation}>{empresa.ubicacion}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1ec',
        padding: 10,
        borderColor: "#cbcbbe",
        borderWidth: 2
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 30,
        textAlign: "center",
        marginTop: "10%",
        marginBottom: 10,
        fontFamily: "Playfair"
    },
    TituloLocales: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 10,
        color: "#333",
        fontFamily: "Playfair"
    },
    localesContainer: {
        marginTop: 10,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#fdf8d5',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#cbcbbe",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Raleway"
    },
    cardLocation: {
        fontSize: 14,
        color: "#333",
        marginTop: 5,
        fontFamily: "Raleway"
    },
});

export default HomeScreen;
