import {
    Alert,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Screen, MainText } from '../../components';
import { isEmailValid } from '../../utils/isEmailValid';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SIZES } from '../../constants';
import InputField from '../../components/InputField';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { login, signup } from '../../redux/authReducer/authActions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackScreenParams } from '../../types';
import { formatPhone } from '../../utils/formatPhone';
import Loader from '../../components/Loader';
import { AppUser } from '../../redux/authReducer/authSlide';
import { useNavigation } from '@react-navigation/core';

type Props = NativeStackScreenProps<AuthStackScreenParams, 'LoginScreen'>;

export interface UserSignUpData extends AppUser {
    password?: string;
}

const SignupScreen: React.FC<Props> = ({ route }) => {
    const {
        error,
        user,
        loading: userLoading
    } = useAppSelector((state) => state.auth);
    const navigation = useNavigation();
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [lastNameError, setLastNameError] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    console.log(route.params);
    const validateEmail = (value: string) => {
        if (!isEmailValid(value) && value.length > 0) {
            setEmailError('Invalid Email');
            return;
        } else {
            setEmailError('');
        }
    };

    const validateName = (value: string) => {
        if (value.length < 3) {
            setNameError('Name must be at least 3 characters');
            return;
        } else {
            setNameError('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.length < 3) {
            setLastNameError('Last Name must be at least 3 characters');
            return;
        } else {
            setLastNameError('');
        }
    };
    const validatePhone = (value: string) => {
        if (value.length < 10 && value.length > 5) {
            setPhoneError('Invalid phone');
            return;
        } else {
            setPhoneError('');
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

    const validateConfirmPassword = (value: string) => {
        if ((value.length < 6 && value.length > 3) || value !== password) {
            setPasswordConfirmError('Passwords must match');
            return;
        } else {
            setPasswordConfirmError('');
        }
    };

    const handleSignUp = async () => {
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

            const userData: UserSignUpData = {
                name,
                lastName,
                favoriteStores: [],
                imageUrl: null,
                phone,
                role: 'user',
                email,
                password: password!,
                signedDate: new Date().toISOString()
            };

            const {
                meta: { requestStatus },

                payload
            } = await dispatch(signup(userData));

            if (requestStatus === 'rejected') {
                Alert.alert('Error', payload as string, [
                    { text: 'OK', style: 'cancel' }
                ]);
                return;
            }

            if (requestStatus === 'fulfilled') {
                // @ts-ignore
                if (route.params?.previewScreen) {
                    navigation.navigate('CartStack', { screen: 'Checkout' });
                } else {
                    navigation.navigate('ProfileStack');
                }
            }
            // if (result.type === '')

            // if (!user?.emailVerified) {
            //     console.log(user);
            //     Alert.alert(
            //         'Email not Verified',
            //         'You must verify your email first. \n Please check your email',
            //         [
            //             { MainText: 'Ok', style: 'cancel' },
            //             {
            //                 MainText: 'Resend Link',
            //                 onPress: () => user?.sendEmailVerification()
            //             }
            //         ]
            //     );
            //     setLoading(false);
            //     return;
            // }
        } catch (error: any) {
            //@ts-ignore
            console.log(error.message);
            setLoading(false);
            //@ts-ignore
            Alert.alert('Error', error.message, [
                { text: 'OK', style: 'cancel' }
            ]);
        }
    };

    useEffect(() => {
        setLoading(false);
        if (user) {
            navigation.navigate('ProfileStack', { screen: 'Profile' });
        }
    }, [user]);

    if (loading || userLoading) return <Loader />;

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
                    <MainText
                        style={{ paddingVertical: SIZES.padding }}
                        tange
                        center
                        large
                    >
                        Sign Up
                    </MainText>
                    <InputField
                        label="First Name"
                        placeholder="Type your first name"
                        autoCapitalize="words"
                        value={name}
                        onChangeText={(MainText) => {
                            validateName(MainText);
                            setName(MainText);
                        }}
                        errorMessage={nameError}
                        leftIcon={
                            <AntDesign
                                name="user"
                                size={20}
                                color={theme.TEXT_COLOR}
                            />
                        }
                    />
                    <InputField
                        label="Last Name"
                        placeholder="Type your last name"
                        autoCapitalize="words"
                        value={lastName}
                        onChangeText={(text) => {
                            validateLastName(text);
                            setLastName(text);
                        }}
                        errorMessage={lastNameError}
                        leftIcon={
                            <AntDesign
                                name="user"
                                size={20}
                                color={theme.TEXT_COLOR}
                            />
                        }
                    />
                    <InputField
                        label="Phone"
                        placeholder="Type your phone number"
                        keyboardType="phone-pad"
                        maxLenght={14}
                        value={phone}
                        onChangeText={(text) => {
                            validatePhone(text);
                            setPhone(formatPhone(text));
                        }}
                        errorMessage={lastNameError}
                        leftIcon={
                            <AntDesign
                                name="user"
                                size={20}
                                color={theme.TEXT_COLOR}
                            />
                        }
                    />
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
                    <InputField
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => {
                            validateConfirmPassword(text.trim());
                            setConfirmPassword(text.trim());
                        }}
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
                        rightIcon={
                            confirmPassword.length > 0 ? (
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
                        value={confirmPassword}
                        errorMessage={passwordConfirmError}
                    />
                    <TouchableHighlight
                        style={{ marginBottom: 5 }}
                        activeOpacity={0}
                        underlayColor={theme.BACKGROUND_COLOR}
                        onPress={() => {}}
                    >
                        <MainText caption right>
                            Forgot Password?
                        </MainText>
                    </TouchableHighlight>

                    <Button onPress={handleSignUp} small>
                        <MainText lightText bold center>
                            Sign Up
                        </MainText>
                    </Button>
                </AuthContainer>
                <View
                    style={{
                        margin: 20,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <MainText>Already have an account?</MainText>
                    <SignUpButton
                        onPress={() => {
                            navigation.navigate('ProfileStack', {
                                screen: 'LoginScreen'
                            });
                        }}
                    >
                        <MainText>Login</MainText>
                    </SignUpButton>
                </View>
            </KeyboardAwareScrollView>
        </Screen>
    );
};

export default SignupScreen;

const AuthContainer = styled.View`
    align-self: center;
    margin: 5px 20px;
    justify-content: center;
`;

const SignUpButton = styled.TouchableOpacity`
    padding: 10px;
`;
