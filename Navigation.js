import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pantallas
import HomeScreen from "./screens/HomeScreen";
import PerfilScreen from "./screens/PerfilScreen";
import RegistroUserScreen from "./screens/RegistroUserScreen";
import CitasScreen from "./screens/CitasScreen";
import DentroLocalScreen from "./screens/DentroLocalScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistroEmpresaScreen from "./screens/RegistroEmpresaScreen";
import ReservarScreen from "./screens/ReservarScreen";
import ServiciosScreen from "./screens/ServiciosScreen";
import CitasEmpresaScreen from "./screens/CitasEmpresaScreen";
import PerfilEmpresaScreen from "./screens/PerfilEmpresaScreen";
import PerfilBaseScreen from './screens/PerfilBaseScreen';
import HomeLocalScreen from './screens/HomeScreenEmpresa';
import EditarServicio from './screens/EditarServicio';

const HomeStackNavigator = createNativeStackNavigator();

function MyStack() {
    return (
        <HomeStackNavigator.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{ headerShown: false }}
        >
            <HomeStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
            <HomeStackNavigator.Screen name="Registro" component={RegistroUserScreen} />
            <HomeStackNavigator.Screen name="Local" component={DentroLocalScreen} />
            <HomeStackNavigator.Screen name="LoginUsuarios" component={LoginScreen} />
            <HomeStackNavigator.Screen name="RegistroEmpresa" component={RegistroEmpresaScreen} />
            <HomeStackNavigator.Screen name="Reserva" component={ReservarScreen} />
            <HomeStackNavigator.Screen name="PerfilScreen" component={PerfilScreen} />
            <HomeStackNavigator.Screen name="HomeEmpresa" component={HomeLocalScreen} />
        </HomeStackNavigator.Navigator>
    );
}

// Navigator para el usuario
const PerfilStackNavigator = createNativeStackNavigator();

function PerfilStack() {
    return (
        <PerfilStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <PerfilStackNavigator.Screen name="PerfilScreen" component={PerfilScreen} />
            <PerfilStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
            <PerfilStackNavigator.Screen name="Registro" component={RegistroUserScreen} />
            <PerfilStackNavigator.Screen name="LoginScreen" component={LoginScreen} />
            <PerfilStackNavigator.Screen name="RegistroEmpresa" component={RegistroEmpresaScreen} />
        </PerfilStackNavigator.Navigator>
    );
}

// Navigator para la empresa
const PerfilEmpresaStackNavigator = createNativeStackNavigator();

function PerfilEmpresaStack() {
    return (
        <PerfilEmpresaStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <PerfilEmpresaStackNavigator.Screen name="PerfilEmpresaScreen" component={PerfilEmpresaScreen} />
            <PerfilEmpresaStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
            <PerfilEmpresaStackNavigator.Screen name="Registro" component={RegistroUserScreen} />
            <PerfilEmpresaStackNavigator.Screen name="LoginScreen" component={LoginScreen} />
            <PerfilEmpresaStackNavigator.Screen name="RegistroEmpresa" component={RegistroEmpresaScreen} />
            <PerfilEmpresaStackNavigator.Screen name="HomeEmpresa" component={HomeLocalScreen} />
            <PerfilEmpresaStackNavigator.Screen name="EditarServicio" component={EditarServicio} />
        </PerfilEmpresaStackNavigator.Navigator>
    );
}

// Navigator para el perfil sin registro (creo)
const PerfilBaseStackNavigator = createNativeStackNavigator();

function PerfilBaseStack() {
    return (
        <PerfilBaseStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <PerfilBaseStackNavigator.Screen name="PerfilEmpresaScreen" component={PerfilBaseScreen} />
            <PerfilBaseStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
            <PerfilBaseStackNavigator.Screen name="Registro" component={RegistroUserScreen} />
            <PerfilBaseStackNavigator.Screen name="LoginScreen" component={LoginScreen} />
            <PerfilBaseStackNavigator.Screen name="RegistroEmpresa" component={RegistroEmpresaScreen} />
            <PerfilBaseStackNavigator.Screen name="PerfilScreen" component={PerfilScreen} />
        </PerfilBaseStackNavigator.Navigator>
    );
}

// Nuevo stack para la edicion de servicios
const EmpresaStack = createNativeStackNavigator();

function EmpresaStackScreen() {
    return (
        <EmpresaStack.Navigator screenOptions={{ headerShown: false }}>
            <EmpresaStack.Screen name="HomeEmpresa" component={HomeLocalScreen} />
            <EmpresaStack.Screen name="EditarServicio" component={EditarServicio} />
            <EmpresaStack.Screen name="Reserva" component={ReservarScreen} />
        </EmpresaStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function Mytabs() {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const loadUserType = async () => {
            try {
                const storedUserType = await AsyncStorage.getItem("userType");
                setUserType(storedUserType || null);
            } catch (error) {
                console.error("Error obteniendo user", error);
            }
        };

        loadUserType();
        const intervalo = setInterval(loadUserType, 3000);
        return () => clearInterval(intervalo);
    }, []);

    return (
        <Tab.Navigator
            initialRouteName={userType === "empresa" ? "HomeEmpresa" : userType === "usuario" ? "Home" : "PerfilBase"}
            screenOptions={{
                tabBarActiveTintColor: '#266150',
                tabBarInactiveBackgroundColor: '#fdf8d5',
                tabBarActiveBackgroundColor: '#fdf8d5',
                tabBarStyle: {
                    height: 60,
                    borderColor: "#cbcbbe",
                    borderWidth: 3,
                },
            }}
        >
            {userType === "empresa" && (
                <Tab.Screen 
                    name="HomeEmpresa" 
                    component={EmpresaStackScreen} 
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Entypo name="home" size={24} color="#266150" />
                        ),
                        headerShown: false,
                    }}
                />
            )}

            {userType !== "empresa" && (
                <Tab.Screen 
                    name="Home" 
                    component={MyStack}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={24} color="#266150" />
                        ),
                        headerShown: false,
                    }}
                />
            )}

            {userType === "usuario" && (
                <Tab.Screen 
                    name="Perfil" 
                    component={PerfilStack}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome6 name="user-large" size={24} color="#266150" />
                        ),
                        headerShown: false,
                    }}
                />
            )}

            {userType === "empresa" && (
                <Tab.Screen 
                    name="PerfilEmpresaScreen" 
                    component={PerfilEmpresaStack}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome6 name="user-large" size={24} color="#266150" />
                        ),
                        headerShown: false,
                    }}
                />
            )}

            {userType === "usuario" && (
                <Tab.Screen 
                    name="Citas" 
                    component={CitasScreen} 
                    options={{
                        tabBarLabel: 'Citas',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="calendar" size={24} color="#266150" />
                        ),
                        headerShown: false,
                    }}
                />
            )}

            {userType === "empresa" && (
                <Tab.Screen 
                    name="CitasEmpresa" 
                    component={CitasEmpresaScreen} 
                    options={{
                        tabBarLabel: 'Citas',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="calendar" size={24} color="#266150" />
                        ),
                        headerShown: false,
                    }}
                />
            )}

            {userType === null && (
                <Tab.Screen 
                    name="PerfilBase" 
                    component={PerfilBaseStack} 
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome6 name="user-large" size={24} color="#266150" />
                        ),
                        headerShown: false,
                    }}
                />
            )}
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <Mytabs/>
        </NavigationContainer>
    );
}
