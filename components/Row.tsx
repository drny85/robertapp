import { View, ViewStyle } from 'react-native';
import React, { FC } from 'react';

interface Props {
    verticalAlign?: ViewStyle['alignItems'] | undefined;
    horizontalAlign?: ViewStyle['justifyContent'] | undefined;
    containerStyle?: ViewStyle;
}

const Row: FC<Props> = ({
    verticalAlign,
    horizontalAlign,
    children,
    containerStyle
}): JSX.Element => {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: horizontalAlign || 'flex-start',
                alignItems: verticalAlign || 'flex-start',
                ...containerStyle
            }}
        >
            {children}
        </View>
    );
};

export default Row;
