import { View } from 'react-native';
import React, { FC } from 'react';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';
import { useAppSelector } from '../redux/store';

interface Props {
    title: string;
    checked: boolean;
    onPress: () => void;
}
const CkeckBox: FC<Props> = ({ title, onPress, checked }) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <View>
            <CheckBox
                textStyle={{
                    color: theme.WHITE_COLOR,
                    textTransform: 'capitalize'
                }}
                containerStyle={{
                    backgroundColor: theme.SECONDARY_BUTTON_COLOR,
                    borderColor: theme.SHADOW_COLOR,
                    borderRadius: 30,
                    height: 40,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                title={title}
                checked={checked}
                checkedColor={theme.PRIMARY_BUTTON_COLOR}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                onPress={onPress}
            />
        </View>
    );
};

export default CkeckBox;
