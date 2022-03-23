import React from 'react';

import Restaurant from '../../screens/restaurants/Restaurant';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Restaurants from '../../screens/restaurants/Restaurants';
import { RestaurantsStackParamList } from '../../types';
import ProductDetails from '../../screens/restaurants/ProductDetails';

const { Navigator, Screen } =
    createNativeStackNavigator<RestaurantsStackParamList>();

const RestaurantsStack = () => {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }}
        >
            <Screen name="Restaurants" component={Restaurants} />
            <Screen name="Restaurant" component={Restaurant} />
            <Screen name="ProductDetails" component={ProductDetails} />
        </Navigator>
    );
};
export default RestaurantsStack;
