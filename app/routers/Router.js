import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements"

import RestaurantsStack from '../routers/RestaurantsStack';
import FavoritesStack from "../routers/FavoritesStack";
import AccountStack from "../routers/AccountStack";
import TopRestaurantsStack from "../routers/TopRestaurantsStack";
import SearchStack from "../routers/SearchStack";

const Tab = createBottomTabNavigator();

export default function Router() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="restaurants"
                tabBarOptions={{
                    inactiveTintColor: "#646464",
                    activeTintColor: "#00a680"
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })}
            >
                <Tab.Screen name="restaurants" component={RestaurantsStack} options={{ title: 'Restaurantes' }} />
                <Tab.Screen name="favorites" component={FavoritesStack} options={{ title: 'Favorites' }} />
                <Tab.Screen name="search" component={SearchStack} options={{ title: 'Buscar' }} />
                <Tab.Screen name="top" component={TopRestaurantsStack} options={{ title: 'Top 5' }} />
                <Tab.Screen name="account" component={AccountStack} options={{ title: 'Cuenta' }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color) {

    let iconName;
    switch (route.name) {
        case "restaurants":
            iconName = 'compass-outline'
            break;
        case "favorites":
            iconName = 'heart-outline'
            break;
        case "search":
            iconName = 'magnify'
            break;
        case "top":
            iconName = 'star-outline'
            break;
        case "account":
            iconName = 'home-outline'
            break;

        default:
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color}></Icon>
    );
}