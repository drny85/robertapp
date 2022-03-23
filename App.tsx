import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import TabsNavigation from './navigation/TabsNavigation';
import store, { useAppSelector } from './redux/store';
import { ThemeProvider } from 'styled-components';
import Loader from './components/Loader';

const App: React.FC = () => {
    const isLoadingComplete = useCachedResources();

    const theme = useAppSelector((state) => state.theme);
    if (!isLoadingComplete) {
        return null;
    }

    return (
        <ThemeProvider theme={theme}>
            <SafeAreaProvider>
                <NavigationContainer
                    theme={{
                        colors: {
                            ...DefaultTheme.colors,
                            background: theme.BACKGROUND_COLOR,
                            primary: theme.PRIMARY_BUTTON_COLOR
                        },
                        dark: theme.mode === 'dark'
                    }}
                >
                    <TabsNavigation />
                    <StatusBar style="auto" />
                </NavigationContainer>
            </SafeAreaProvider>
        </ThemeProvider>
    );
};

export default () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};
