import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PerfilEmpresaScreen = () => {
    const [InfoEmpresa, setInfoEmpresa] = useState({});
    const navigation = useNavigation();
    const [empresaId, setempresaId] = useState('');
    const [empresaestado, setempresaestado] = useState('');
    const [empresaadmicion, setempresaadmicion] = useState('');
    
    useEffect(() => {
        const loadempresaId = async () => {
            try {
                const storedempresaId = await AsyncStorage.getItem("empresaId");
                if (storedempresaId) {
                    setempresaId(storedempresaId);
                }
            } catch (error) {
                console.error("Error obteniendo empresaId");
            }
        };
        loadempresaId();
    }, []);

    useEffect(() => {
        if (empresaId) {
            const fetchInfoEmpresa = async () => {
                try {
                    const response = await fetch(`http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/empresas/${empresaId}`);
                    const data = await response.json();
                    setempresaestado(data[0][0].estado);
                    setempresaadmicion(data[0][0].admicion);
                    if (data && data[0] && data[0][0]) {
                        setInfoEmpresa(data[0][0]);
                    }
                } catch (error) {
                    console.error("Error al obtener la información de la empresa", error);
                }
            };
            fetchInfoEmpresa();
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.userName}>{empresaId ? InfoEmpresa.nombre : "Inicia sesión o regístrate con nosotros"}</Text>
            </View>
            {empresaId && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}><Text style={styles.label}>Nombre: </Text>{InfoEmpresa.nombre}</Text>
                    <Text style={styles.infoText}><Text style={styles.label}>Dirección: </Text>{InfoEmpresa.direccion}</Text>
                    <Text style={styles.infoText}><Text style={styles.label}>Correo: </Text>{InfoEmpresa.correo}</Text>
                    <Text style={styles.infoText}><Text style={styles.label}>Teléfono: </Text>{InfoEmpresa.telefono}</Text>
                </View>
            )}
            {empresaId && (
                <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                    <Text style={styles.Opciones}>Cerrar sesión</Text>
                </TouchableOpacity>
            )}
            {empresaId && (
                <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, empresaestado === 1 ? styles.active : styles.inactive]}>
                        {empresaestado === 1 ? " Empresa Activa" : " Empresa Inactiva"}
                    </Text>
                    <Text style={[styles.statusText, empresaadmicion === 1 ? styles.approved : empresaadmicion === 2 ? styles.rejected : styles.pending]}>
                        {empresaadmicion === 1 ? " Empresa Admitida" : empresaadmicion === 2 ? " Empresa Rechazada" : " Empresa en Revisión"}
                    </Text>
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1f1ec",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
        marginTop: 40,

    },
    userName: {
        fontSize: 22,
        fontWeight: "",
        color: "#000",
        fontFamily: "Poppins"
    },
    infoContainer: {
        backgroundColor: "#e0cdb6",
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        color: "#000",
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
        color: "#000",
    },
    statusContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    statusText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    active: {
        color: "green",
        marginTop: "15"
    },
    inactive: {
        color: "red",
    },
    approved: {
        color: "green",
    },
    rejected: {
        color: "red",
    },
    pending: {
        color: "orange",
    },
    menuItem: {
        padding: 10,
        backgroundColor: "#266150",
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
