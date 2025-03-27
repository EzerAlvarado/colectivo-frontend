import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const ReservarScreen = ({ route }) => {
    const navigation = useNavigation(); 
    const { servicio } = route.params;

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [horarios, sethorario] = useState(null);
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para que no haga muchas presiones en el boton @ezer 
    const today = new Date().toISOString().split("T")[0];


    useEffect(() => {
        const loadUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                setUserId(storedUserId);
            } catch (error) {
                console.error("Error obteniendo userId", error);
            }
        };
        loadUserId();
    }, []);


    const reservarCita = async () => {
        if (!selectedDate || !selectedTime || isLoading) return;

        setIsLoading(true);

        try {//http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/verhorarios
            const response = await fetch('http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/citas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    empresa: servicio.empresa,
                    usuario: userId,
                    servicio: servicio.id,
                    fecha: selectedDate,
                    hora: selectedTime,
                }),
            });

            if (response.ok) {
                Alert.alert("Reserva Confirmada", `Tu cita está programada para el ${selectedDate} a las ${selectedTime}.`);
                navigation.navigate("HomeScreen");
            } else {
                Alert.alert("Error", "Hubo un problema al reservar la cita.");
                setIsLoading(false); // Reactiva el botón en caso de error
            }
        } catch (error) {
            console.error("Error al crear la cita", error);
            setIsLoading(false); // Reactiva el botón si hay un fallo en la petición
        }
    };
    



    const horariosporfecha = async (fecha) => {
        try {
            console.log(fecha)
            setSelectedDate(fecha)
            const response = await fetch('http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/verhorarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha: fecha
                }),
            });
            const data = await response.json();
            console.log(data)
            sethorario(data)
        } catch (error) {
            console.error("Error al obtener el horario", error);
        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.serviceTitle}>{servicio.nombre}</Text>
                <Text style={styles.serviceDescription}>{servicio.duracion} - {servicio.precio}</Text>
            </View>

            <Calendar
                onDayPress={(day) => horariosporfecha(day.dateString)}
                markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: "#266150" } }}
                minDate={today}
                theme={{
                    selectedDayBackgroundColor: "#6B3F87",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#6B3F87",
                    arrowColor: "#6B3F87",
                }}
                style={styles.calendar}
            />

            <Text style={styles.subTitle}>Selecciona una hora</Text>
            <FlatList
                data={horarios}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.timeSlot, selectedTime === item && styles.selectedTimeSlot]}
                        onPress={() => setSelectedTime(item)}
                    >
                        <Text style={[styles.timeSlotText, selectedTime === item && styles.selectedTimeSlotText]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
            />

            <TouchableOpacity
                style={[styles.reserveButton, isLoading && styles.disabledButton]} 
                onPress={reservarCita}
                disabled={isLoading} // aqui hace lo del boton para que no presione muchas veces
            >
                <Text style={styles.reserveButtonText}>{isLoading ? "Reservando..." : "Reservar"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F5F3",
        padding: 20,
    },
    infoContainer: {
        marginBottom: 20,
    },
    serviceTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginTop: "8%",
    },
    serviceDescription: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginTop: 5,
    },
    calendar: {
        borderRadius: 10,
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    timeSlot: {
        backgroundColor: "#E0E0E0",
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
        width: 120, 
        height: 50, 
    },
    selectedTimeSlot: {
        backgroundColor: "#266150",
    },
    timeSlotText: {
        fontSize: 16,
        color: "#333",
    },
    selectedTimeSlotText: {
        color: "#fff",
    },
    reserveButton: {
        backgroundColor: "#266150",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: "#A0A0A0", 
    },
    reserveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ReservarScreen;