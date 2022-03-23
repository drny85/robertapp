import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from '../../screens/cart/Cart';
import { CartStackScreenParams } from '../../types';

import Checkout from '../../screens/cart/Checkout';
import OrderReview from '../../screens/cart/OrderReview';
import PaymentSuccess from '../../screens/cart/PaymentSuccess';

const { Navigator, Screen } =
    createNativeStackNavigator<CartStackScreenParams>();

const CartStack = () => {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }}
            initialRouteName="Cart"
        >
            <Screen name="Cart" component={Cart} />
            <Screen name="Checkout" component={Checkout} />
            <Screen name="OrderReview" component={OrderReview} />
            <Screen
                name="PaymentSuccess"
                component={PaymentSuccess}
                options={{ gestureEnabled: false }}
            />
        </Navigator>
    );
};

export default CartStack;
