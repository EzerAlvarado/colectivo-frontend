import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import Navigation from "../Navigation";


const RegistroEmpresaScreen = () => {
    const [nombre, setNombre] = useState('');
    const [rfc, setRfc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correoEmpresa, setCorreoEmpresa] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correoAdmin, setCorreoAdmin] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigation = useNavigation();

    const validarCorreo = (email) => {
        const correoLower = email.toLowerCase();
        const regex = /^(\w+([.-]?\w+)*)@(gmail|hotmail|outlook)\.com$/;
        return regex.test(correoLower);
    };

    const validarContrasena = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/;
        return regex.test(password);
    };

    const validarTelefono = (phone) => {
        const regex = /^\d{10}$/;
        return regex.test(phone);
    };

    const validarRFC = (rfc) => {
        const regex = /^[A-Za-z0-9]{12}$/;
        return regex.test(rfc);
    };

    const crearNuevaEmpresa = async () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre de la empresa es obligatorio");
            return;
        }
        if (!validarRFC(rfc)) {
            Alert.alert("Error", "El RFC debe contener 12 caracteres alfanuméricos");
            return;
        }
        if (!direccion.trim()) {
            Alert.alert("Error", "La dirección es obligatoria");
            return;
        }
        if (!validarCorreo(correoEmpresa)) {
            Alert.alert("Error", "El correo de la empresa debe ser válido y pertenecer a Gmail, Hotmail o Outlook");
            return;
        }
        if (!validarTelefono(telefono)) {
            Alert.alert("Error", "El teléfono debe contener exactamente 10 dígitos");
            return;
        }
        if (!validarCorreo(correoAdmin)) {
            Alert.alert("Error", "El correo del administrador debe ser válido y pertenecer a Gmail, Hotmail o Outlook");
            return;
        }
        if (!validarContrasena(contrasena)) {
            Alert.alert("Error", "La contraseña debe tener al menos 7 caracteres, una mayúscula, un número y un carácter especial");
            return;
        }

        try {
            const response = await fetch('https://solobackendintegradora.onrender.com/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    rfc: rfc,
                    direccion: direccion,
                    correoEmpresa: correoEmpresa.toLowerCase(),
                    telefono: telefono,
                    correoAdmin: correoAdmin.toLowerCase(),
                    contrasena: contrasena
                })
            });
            const result = await response.json();
            Alert.alert("Te has Registrado!");
            navigation.navigate("LoginScreen");
        } catch (error) {
            console.error("Error al crear empresa", error);
        }
    };


//Fuentes Personalizadas
const [fontsLoaded] = useFonts({
    Playfair: require('../assets/PlayfairDisplay-VariableFont_wght.ttf'),
    Raleway: require('../assets/Raleway-VariableFont_wght.ttf'),
});
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registra tu Empresa</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la empresa"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="RFC"
                value={rfc}
                onChangeText={setRfc}
            />
            <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={direccion}
                onChangeText={setDireccion}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo de la empresa"
                value={correoEmpresa}
                onChangeText={setCorreoEmpresa}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Correo del administrador"
                value={correoAdmin}
                onChangeText={setCorreoAdmin}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={crearNuevaEmpresa}>
                <Text style={styles.buttonRegistro}>Registrar Empresa</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1ec',
        padding: 20,
        borderColor: "#cbcbbe",
        borderWidth: 2
    },
    title: {
        fontSize: 25,
        textAlign: "center",
        marginVertical: 20,
        fontFamily: "Poppins"
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        borderColor: "#ccc",
        borderWidth: 1,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#266150",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonRegistro: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default RegistroEmpresaScreen;
