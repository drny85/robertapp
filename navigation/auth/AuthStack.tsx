import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from '../../screens/auth/Profile';
import LoginScreen from '../../screens/auth/LoginScreen';
import { AuthStackScreenParams } from '../../types';
import SignupScreen from '../../screens/auth/SignupScreen';
import Success from '../../screens/auth/Success';

const { Navigator, Screen } =
    createNativeStackNavigator<AuthStackScreenParams>();

const AuthStack = () => {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }}
        >
            <Screen name="LoginScreen" component={LoginScreen} />
            <Screen name="SignupScreen" component={SignupScreen} />
            <Screen name="Success" component={Success} />
            <Screen name="Profile" component={Profile} />
        </Navigator>
    );
};

export default AuthStack;
