import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PerfilBaseScreen = () => {
    const [InfoUsuario, setInfoUsuario] = useState({});
    const navigation = useNavigation();
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                if (storedUserId) {
                    setUserId(storedUserId);
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
        if (userId) {
            const fetchInfoUsuario = async () => {
                try {
                    const response = await fetch(`https://solobackendintegradora.onrender.com/usuarios/${userId}`);
                    const data = await response.json();
                    if (data && data[0] && data[0][0]) {
                        setInfoUsuario(data[0][0]);
                    } else {
                        console.error("Problema con la información del usuario");
                    }
                } catch (error) {
                    console.error("Error al obtener la información del usuario:", error);
                }
            };

            fetchInfoUsuario();
            const intervalo = setInterval(fetchInfoUsuario, 3000);

            return () => clearInterval(intervalo);
        }
    }, [userId]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("userType");
            setInfoUsuario({});
            setUserId('');
            navigation.navigate("PerfilScreen");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const [fontsLoaded] = useFonts({
        Playfair: require('../assets/PlayfairDisplay-VariableFont_wght.ttf'),
        Raleway: require('../assets/Raleway-VariableFont_wght.ttf'),
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.userName}>
                    {userId ? `${InfoUsuario.nombre} ${InfoUsuario.apellidos}` : "Inicia sesion o registrate con nosotros"}
                </Text>
            </View>
            {userId && (
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Nombre: </Text>
                    {InfoUsuario.nombre}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Apellidos: </Text>
                    {InfoUsuario.apellidos}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Número de teléfono móvil: </Text>
                    {InfoUsuario.telefono}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Email: </Text>
                    {InfoUsuario.correo}
                </Text>
            </View>
            )}
            {!userId && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Registro")}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Registrarte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("LoginScreen")}
                        style={[styles.button, styles.loginButton]}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            )}

            {userId && (
                <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                    <Text style={styles.Opciones}>Cerrar sesión</Text>
                </TouchableOpacity>
            )}
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
    header: {
        alignItems: "center",
        marginBottom: 20,
        marginTop: "65.02%",

    },
    userName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Raleway",
        textAlign: "center"
    },
    infoContainer: {
        backgroundColor: "#fdf8d5",
        borderRadius: 10,
        padding: 20,
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        color: "#000",
        marginBottom: 10,
        fontFamily: "Raleway",
    },
    label: {
        fontWeight: "bold",
        color: "#000",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 20,
    },
    button: {
        backgroundColor: "#266150",
        padding: 10,
        width: "40%",
        alignItems: "center",
        borderRadius: 10,
    },
    loginButton: {
        backgroundColor: "#266150",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Raleway",
    },
    menuItem: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#d9534f",
        borderRadius: 10,
        alignItems: "center",
    },
    Opciones: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default PerfilBaseScreen;
