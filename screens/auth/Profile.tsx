import { StyleSheet } from 'react-native';
import React from 'react';
import { Screen, MainText } from '../../components';
import FloatingButton from '../../components/FloatingButton';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigation } from '@react-navigation/core';
import { logout } from '../../redux/authReducer/authActions';
import Loader from '../../components/Loader';
import LoginScreen from './LoginScreen';
import { CommonActions } from '@react-navigation/native';

const Profile = (): JSX.Element => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    if (!user) return <LoginScreen />;

    if (loading) return <Loader />;
    return (
        <Screen center>
            <FloatingButton
                iconName="log-out"
                onPress={async () => {
                    const res = await dispatch(logout());
                    console.log('RES', res);
                    navigation.dispatch((state) => {
                        // Remove the home route from the stack
                        console.log(state);
                        const routes = state.routes.filter(
                            (r) => r.name !== 'CartStack'
                        );

                        return CommonActions.reset({
                            ...state,
                            routes,
                            index: routes.length - 1
                        });
                    });
                }}
            />
            <MainText>Profile</MainText>
        </Screen>
    );
};

export default Profile;

const styles = StyleSheet.create({});
