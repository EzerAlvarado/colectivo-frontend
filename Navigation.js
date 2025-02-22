import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


//Pantallas
import LoginScreen from "./Screens/LoginScreen";
import EmpresasScreen from "./Screens/EmpresasScreen";
import SuscripcionesScreen from "./Screens/SuscripcionesScreen";
import DashboardScreen from "./Screens/DashboardScreen";

const MenuStackNavigator = createNativeStackNavigator();

function MyStack() {
    return (
    <MenuStackNavigator.Navigator
        initialRouteName="Login"
    >
        <MenuStackNavigator.Screen
            name="Login"
            component={LoginScreen}
            options={{
                tabBarLabel: 'Menu',
                headerShown: false,
            }}
        />
        <MenuStackNavigator.Screen
            name="Empresas"
            component={EmpresasScreen}
            options={{
                tabBarLabel: 'Menu',
                headerShown: false,
            }}
        />
        <MenuStackNavigator.Screen
            name="Suscripciones"
            component={SuscripcionesScreen}
            options={{
                tabBarLabel: 'Menu',
                headerShown: false,
            }}
        />
            <MenuStackNavigator.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
                tabBarLabel: 'Menu',
                headerShown: false,
            }}
        />

    </MenuStackNavigator.Navigator>
    )
}


const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
        initialRouteName="Menu"
        screenOptions={{
            tabBarStyle: { display: 'none' }
        }}
        >
            <Tab.Screen 
                name="Menu" 
                component={MyStack}
                options={{
                    tabBarLabel: 'Menu',
                    headerShown: false,
                }} 
            />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}