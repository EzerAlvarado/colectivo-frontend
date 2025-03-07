import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";


const PerfilEmpresaScreen = () => {
    const [InfoEmpresa, setInfoEmpresa] = useState({});
    const navigation = useNavigation();
    const [empresaId, setempresaId] = useState('');

    useEffect(() => {
        const loadempresaId = async () => {
            try {
                const storedempresaId = await AsyncStorage.getItem("empresaId");
                if (storedempresaId ) {
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
            const fetchInfoEmpresa = async () => {
                try {
                    const response = await fetch(`https://solobackendintegradora.onrender.com/empresas/${empresaId}`);
                    const data = await response.json();
                    if (data && data[0] && data[0][0]) {
                        setInfoEmpresa(data[0][0]);
                    } else {
                        console.error("Problema con la información de la empresa");
                    }
                } catch (error) {
                    console.error("Error al obtener la información de la empresa", error);
                }
            };

            fetchInfoEmpresa();
            const intervalo = setInterval(fetchInfoEmpresa, 3000);

            return () => clearInterval(intervalo);
        }
    }, [empresaId]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("empresaId");
            await AsyncStorage.removeItem("userType");
            setInfoEmpresa({});
            setempresaId('');
            navigation.navigate("HomeScreen");
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
                    {empresaId ? `${InfoEmpresa.nombre}` : "Inicia sesion o registrate con nosotros"}
                </Text>
            </View>
            {empresaId && (
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Nombre: </Text>
                    {InfoEmpresa.nombre}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Direccion: </Text>
                    {InfoEmpresa.direccion}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Correo: </Text>
                    {InfoEmpresa.correo}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Telefono: </Text>
                    {InfoEmpresa.telefono}
                </Text>
            </View>
            )}
            {!empresaId && (
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

            {empresaId && (
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
        marginTop: 40,
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

export default PerfilEmpresaScreen;
