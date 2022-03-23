import { Alert, FlatList, ListRenderItem, View } from 'react-native';
import React from 'react';
import { Button, Screen, MainText } from '../../components';

import FloatingButton from '../../components/FloatingButton';
import Row from '../../components/Row';
import { FONTS, SIZES } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { CartItem } from '../../redux/cartReducer/cartSlide';

import CartItemList from '../../components/CartItemList';
import { clearCart } from '../../redux/cartReducer/cartActions';
import { useNavigation } from '@react-navigation/core';

const Cart = () => {
    const navigation = useNavigation();

    const { cartItems } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const cartIsNotEmpty = () => cartItems.length === 0;
    const renderCartItems: ListRenderItem<CartItem> = ({ item, index }) => {
        return <CartItemList product={item} />;
    };
    return (
        <Screen>
            <Row
                horizontalAlign="space-between"
                verticalAlign="center"
                containerStyle={{ marginHorizontal: 10 }}
            >
                <MainText></MainText>
                <MainText bold title>
                    Cart
                </MainText>
                {!cartIsNotEmpty() ? (
                    <FloatingButton
                        iconName="trash"
                        onPress={async () => {
                            Alert.alert(
                                'Clear Cart',
                                'Do you want to empty the cart?',
                                [
                                    { text: 'No', style: 'cancel' },
                                    {
                                        text: 'Yes',
                                        onPress: async () =>
                                            await dispatch(clearCart())
                                    }
                                ]
                            );
                        }}
                    />
                ) : (
                    <MainText></MainText>
                )}
            </Row>
            {!cartIsNotEmpty() ? (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item, index) => item.id! + index}
                        renderItem={renderCartItems}
                    />
                    {cartItems.length > 0 && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 20,
                                left: 0,
                                right: 0,
                                width: SIZES.width,
                                alignSelf: 'center'
                            }}
                        >
                            <Button
                                onPress={() => {
                                    if (user) {
                                        console.log('HHH');
                                        return navigation.navigate(
                                            'CartStack',
                                            { screen: 'Checkout' }
                                        );
                                    } else {
                                        navigation.navigate('ProfileStack', {
                                            screen: 'LoginScreen',
                                            params: {
                                                previewScreen: 'Checkout'
                                            }
                                        });
                                    }
                                }}
                                small
                                style={{
                                    width: SIZES.width * 0.5,
                                    alignSelf: 'center'
                                }}
                            >
                                <MainText center bold lightText>
                                    Check Out
                                </MainText>
                            </Button>
                        </View>
                    )}
                </>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <MainText style={{ ...FONTS.body3, paddingVertical: 10 }}>
                        No Items
                    </MainText>
                    <Button
                        small
                        // @ts-ignore
                        onPress={() => navigation.navigate('RestaurantsStack')}
                    >
                        <MainText style={{ ...FONTS.h4, color: '#ffffff' }}>
                            Start Shopping
                        </MainText>
                    </Button>
                </View>
            )}
        </Screen>
    );
};

export default Cart;
