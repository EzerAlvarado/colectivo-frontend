// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
// import { useFonts } from "expo-font";
// import { useNavigation } from "@react-navigation/native";

// const servicios = [
//     { id: "1", categoria: "Cortes de Cabello", servicio: "Corte en capas" },
//     { id: "2", categoria: "Cortes de Cabello", servicio: "Desvanecido" },
//     { id: "3", categoria: "Cortes de Cabello", servicio: "Corte de puntas" },
//     { id: "4", categoria: "Uñas", servicio: "Manicura básica" },
//     { id: "5", categoria: "Uñas", servicio: "Acrílicas" },
//     { id: "6", categoria: "Uñas", servicio: "Gelish" },
//     { id: "7", categoria: "Pedicure", servicio: "Pedicure spa" },
//     { id: "8", categoria: "Pedicure", servicio: "Pedicure clásico" },
//     { id: "9", categoria: "Pedicure", servicio: "Pedicure Supreme" },
// ];

// const ServiciosScreen = () => {
//     const navigation = useNavigation();
//     const [fontsLoaded] = useFonts({
//         Playfair: require('../assets/PlayfairDisplay-VariableFont_wght.ttf'),
//     });
//     const [seleccionados, setSeleccionados] = useState([]);

//     const toggleSeleccion = (id) => {
//         setSeleccionados(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
//     };

//     const agregarServicios = () => {
//         if (seleccionados.length === 0) {
//             Alert.alert("Error", "Debes seleccionar al menos un servicio para agregar.");
//         } else {
//             Alert.alert("Éxito", "¡Agregaste Servicios!");
//         }
//     };

//     const categorias = Array.from(new Set(servicios.map(s => s.categoria)));

//     return (
//         <ScrollView style={styles.container}>
//             <Text style={styles.title}>Nuestros Servicios</Text>
//             {categorias.map((categoria) => (
//                 <View key={categoria}>
//                     <Text style={styles.categoria}>{categoria}</Text>
//                     <View style={styles.serviciosContainer}>
//                         {servicios.filter(s => s.categoria === categoria).map((item) => (
//                             <TouchableOpacity 
//                                 key={item.id} 
//                                 style={[styles.button, seleccionados.includes(item.id) && styles.buttonSelected]} 
//                                 onPress={() => toggleSeleccion(item.id)}
//                             >
//                                 <Text style={styles.buttonText}>{item.servicio}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>
//             ))}
//             <TouchableOpacity style={styles.addButton} onPress={agregarServicios}>
//                 <Text style={styles.addButtonText}>Agregar Servicios</Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f1f1ec',
//         padding: 20,
//         borderColor: "#cbcbbe",
//         borderWidth: 2
//     },
//     title: {
//         fontSize: 25,
//         textAlign: "center",
//         marginVertical: 20,
//         fontFamily: "Playfair",
//     },
//     categoria: {
//         fontSize: 20,
//         fontWeight: "bold",
//         marginVertical: 10,
//     },
//     serviciosContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "space-between",
//     },
//     button: {
//         backgroundColor: "#266150",
//         padding: 15,
//         borderRadius: 10,
//         alignItems: "center",
//         justifyContent: "center",
//         margin: 5,
//         width: "30%", 
//     },
//     buttonSelected: {
//         backgroundColor: "#1b4030",
//     },
//     buttonText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     addButton: {
//         backgroundColor: "#c94c4c",
//         padding: 15,
//         borderRadius: 10,
//         alignItems: "center",
//         marginTop: 20,
//     },
//     addButtonText: {
//         color: "#fff",
//         fontSize: 18,
//         fontWeight: "bold",
//     }
// });

// export default ServiciosScreen;
