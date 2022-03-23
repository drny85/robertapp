import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppSelector } from '../redux/store'

interface Props {
    containerStyle?: ViewStyle;
    center?: boolean;
}

const Screen: React.FC<Props> = ({ children, containerStyle, center }) => {
    const theme = useAppSelector((state) => state.theme)
    return (
        <SafeAreaView
            style={[
                {
                    backgroundColor: theme.BACKGROUND_COLOR,
                    flex: 1,
                    alignItems: center ? 'center' : undefined,
                    justifyContent: center ? 'center' : undefined
                },
                { ...containerStyle }
            ]}
        >
            <StatusBar style={theme.mode === 'dark' ? 'light' : 'auto'} />
            {children}
        </SafeAreaView>
    )
}

export default Screen
