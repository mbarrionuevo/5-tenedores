import React from "react";
import { createStackNavigator } from "@react-navigation/stack"

import Restaurants from "../pages/Restaurants/Restaurants";
import AddRestaurant from "../pages/Restaurants/AddRestaurant";
import Restaurant from "../pages/Restaurants/Restaurant";
import AddReviewRestaurant from "../pages/Restaurants/AddReviewRestaurant"

const Stack = createStackNavigator();

export default function RestaurantsStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurantes" }}
            />
            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurant}
                options={{ title: "Añadir Restaurante" }}
            />
            <Stack.Screen
                name="restaurant"
                component={Restaurant}
            />
            <Stack.Screen
                name="add-review-restaurant"
                component={AddReviewRestaurant}
                options={{ title: "Nuevo Comentario" }}
            />
        </Stack.Navigator>
    )
}