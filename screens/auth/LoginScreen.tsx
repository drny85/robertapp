import {
    Alert,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { Button, Screen, Text } from '../../components';
import { isEmailValid } from '../../utils/isEmailValid';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SIZES } from '../../constants';
import InputField from '../../components/InputField';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { login } from '../../redux/authReducer/authActions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackScreenParams } from '../../types';
import Loader from '../../components/Loader';
import { useNavigation, useRoute } from '@react-navigation/core';
import Profile from './Profile';

type Props = NativeStackScreenProps<AuthStackScreenParams, 'LoginScreen'>;

const LoginScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { error, user } = useAppSelector((state) => state.auth);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const validateEmail = (value: string) => {
        if (!isEmailValid(value) && value.length > 0) {
            setEmailError('Invalid Email');
            return;
        } else {
            setEmailError('');
        }
    };
    const validatePassword = (value: string) => {
        if (value.length < 6 && value.length > 0) {
            setPasswordError('Password must be at least 6 characters');
            return;
        } else {
            setPasswordError('');
        }
    };

    const handleSignIn = async () => {
        try {
            if (email === '' || password === '') {
                Alert.alert('Error', 'Both Fields Required', [
                    { text: 'OK', style: 'cancel' }
                ]);
                return;
            } else if (!isEmailValid(email)) {
                Alert.alert('Error', 'Email is invalid', [
                    { text: 'OK', style: 'cancel' }
                ]);
                return;
            } else if (password.length < 6) {
                Alert.alert('Error', 'Password is too short', [
                    { text: 'OK', style: 'cancel' }
                ]);
                return;
            }

            const {
                meta: { requestStatus },
                type,
                payload
            } = await dispatch(login({ email, password }));

            if (requestStatus === 'rejected') {
                Alert.alert('Error', payload as string, [
                    { text: 'OK', style: 'cancel' }
                ]);
                return;
            }

            if (requestStatus === 'fulfilled') {
                if (user && !route.params) {
                    navigation.navigate('ProfileStack');
                } else if (user && route.params) {
                    navigation.navigate('CartStack', {
                        //@ts-ignore
                        screen: route.params.previewScreen
                    });
                }
            }
        } catch (error) {
            //@ts-ignore
            console.log(error.message);
            setLoading(false);
            //@ts-ignore
            Alert.alert('Error', error.message, [
                { text: 'OK', style: 'cancel' }
            ]);
        }
    };
    if (user) return <Profile />;

    useEffect(() => {
        setLoading(false);
        return () => {};
    }, [user]);

    if (loading) return <Loader />;

    return (
        <Screen>
            <KeyboardAwareScrollView
                keyboardDismissMode="on-drag"
                contentContainerStyle={{
                    flex: 1,
                    width: SIZES.width,
                    alignItems: 'center'
                }}
            >
                <AuthContainer
                    style={{
                        flex: 1,
                        width: SIZES.width * 0.95,

                        maxWidth: !SIZES.isSmallDevice
                            ? SIZES.width * 0.7
                            : SIZES.width
                    }}
                >
                    <Text
                        style={{ paddingVertical: SIZES.padding }}
                        tange
                        center
                        large
                        animation="fadeIn"
                    >
                        Sign In
                    </Text>
                    <InputField
                        label="Email"
                        placeholder="Type your email"
                        onChangeText={(text) => {
                            validateEmail(text);
                            setEmail(text);
                        }}
                        keyboardType="email-address"
                        value={email}
                        errorMessage={emailError}
                        leftIcon={
                            <MaterialIcons
                                name="email"
                                size={20}
                                color={
                                    theme.mode === 'dark'
                                        ? '#ffffff'
                                        : '#212121'
                                }
                            />
                        }
                    />
                    <InputField
                        label="Password"
                        placeholder="Type your password"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => {
                            validatePassword(text.trim());
                            setPassword(text.trim());
                        }}
                        value={password}
                        errorMessage={passwordError}
                        rightIcon={
                            password.length > 0 ? (
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <Feather
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color={
                                            theme.mode === 'dark'
                                                ? '#ffffff'
                                                : '#212121'
                                        }
                                    />
                                </TouchableOpacity>
                            ) : undefined
                        }
                        leftIcon={
                            <MaterialIcons
                                name="lock"
                                size={20}
                                color={
                                    theme.mode === 'dark'
                                        ? '#ffffff'
                                        : '#212121'
                                }
                            />
                        }
                    />
                    <TouchableHighlight
                        style={{ marginBottom: 5 }}
                        activeOpacity={0}
                        underlayColor={theme.BACKGROUND_COLOR}
                        onPress={() => {}}
                    >
                        <Text caption right>
                            Forgot Password?
                        </Text>
                    </TouchableHighlight>

                    <Button onPress={handleSignIn} small>
                        <Text lightText bold center large>
                            Login
                        </Text>
                    </Button>
                </AuthContainer>
                <View
                    style={{
                        marginBottom: 20,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Text>Do not have an account?</Text>
                    <SignUpButton
                        onPress={() => {
                            navigation.navigate('ProfileStack', {
                                screen: 'SignupScreen'
                            });
                        }}
                    >
                        <Text>Sign Up</Text>
                    </SignUpButton>
                </View>
            </KeyboardAwareScrollView>
        </Screen>
    );
};

export default LoginScreen;

const AuthContainer = styled.View`
    align-self: center;
    margin: 5px 20px;
    justify-content: center;
`;

const SignUpButton = styled.TouchableOpacity`
    padding: 10px;
`;
