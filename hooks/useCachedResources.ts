import { lightTheme } from './../Theme';
import { useAppDispatch } from './../redux/store';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import useColorScheme from './useColorScheme';
import { darkTheme } from '../Theme';
import { switchTheme } from '../redux/themeReducer/themeSlide';
import { getCartItems } from '../redux/cartReducer/cartActions';
import { LogBox } from 'react-native';

import { auth } from '../firebase';
import { setUserRole } from '../redux/authReducer/authSlide';
import { autoLogin } from '../redux/authReducer/authActions';

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);
    const isDark = useColorScheme() === 'dark';
    const dispatch = useAppDispatch();

    const autoSignIn = async () => {
        try {
            auth.onAuthStateChanged((authState) => {
                if (authState?.uid) {
                    if (authState.emailVerified) {
                        authState.getIdTokenResult().then((res) => {
                            const role = res.claims.role;

                            if (role) {
                                dispatch(setUserRole(role));
                            } else {
                                dispatch(setUserRole());
                            }
                        });

                        return dispatch(autoLogin(authState?.uid));
                    } else {
                        //dispatch(logout());
                        return dispatch(autoLogin(authState?.uid));
                    }
                    //return dispatch(logout());
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                LogBox.ignoreAllLogs(true);
                SplashScreen.preventAutoHideAsync();

                // Load fonts
                isDark
                    ? dispatch(switchTheme(darkTheme))
                    : dispatch(switchTheme(lightTheme));
                await Font.loadAsync({
                    ...FontAwesome.font,
                    montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
                    'montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
                    lobster: require('../assets/fonts/Lobster-Regular.ttf'),
                    tange: require('../assets/fonts/Tangerine-Regular.ttf'),
                    italic: require('../assets/fonts/Montserrat-LightItalic.ttf')
                });
                await autoSignIn();
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                SplashScreen.hideAsync();
                dispatch(getCartItems());
            }
        }

        loadResourcesAndDataAsync();
    }, [isDark]);

    return isLoadingComplete;
}
