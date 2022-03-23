import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../redux/store';

interface Props {
    iconName: typeof Feather['name'] | any;
    onPress: () => void;
    containerStyle?: ViewStyle;
    size?: number;
}

const FloatingButton: FC<Props> = ({
    iconName,
    onPress,
    containerStyle,
    size
}) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    ...containerStyle,
                    backgroundColor: theme.SECONDARY_BUTTON_COLOR,
                    shadowColor: theme.SHADOW_COLOR
                }
            ]}
            onPress={onPress}
        >
            <Feather
                name={iconName}
                size={size ? size : 24}
                color={theme.WHITE_COLOR}
            />
        </TouchableOpacity>
    );
};

export default FloatingButton;

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.7
    }
});
