import { StyleSheet, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import styled from 'styled-components/native';
import FloatingButton from './FloatingButton';
import Row from './Row';
import { FONTS, SIZES } from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainText } from '.';

interface Props {
    onPressBack: () => void;
    onPress: () => void;
    cartItemsCount: number;
}

const Header: FC<Props> = ({
    onPressBack,
    children,
    onPress,
    cartItemsCount
}) => {
    return (
        <HeaderView style={{ paddingHorizontal: SIZES.padding * 0.5 }}>
            <Row horizontalAlign="space-between" verticalAlign="center">
                <FloatingButton iconName="arrow-left" onPress={onPressBack} />
                {children}
                <TouchableOpacity
                    onPress={onPress}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <View>
                        <FloatingButton
                            size={20}
                            iconName="shopping-cart"
                            onPress={onPress}
                        />
                        {cartItemsCount > 0 && (
                            <View
                                style={{
                                    position: 'absolute',
                                    right: 5,
                                    top: 5,
                                    height: 20,
                                    zIndex: 20,
                                    width: 20,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    backgroundColor: '#ffffff'
                                }}
                            >
                                <MainText darkText bold center>
                                    {cartItemsCount}
                                </MainText>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Row>
        </HeaderView>
    );
};

export default Header;

const HeaderView = styled.View``;
