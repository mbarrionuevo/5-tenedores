import React from "react";
import { createStackNavigator } from "@react-navigation/stack"

import TopRestaurants from "../pages/TopRestaurants";

const Stack = createStackNavigator();

export default function TopRestaurantsStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="topRestaurant"
                component={TopRestaurants}
                options={{ title: "Top 10" }}
            />
        </Stack.Navigator>
    )
}