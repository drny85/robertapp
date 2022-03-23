import {
    Alert,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Button, Screen, MainText, Divider } from '../../components';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Cart from './Cart';
import styled from 'styled-components/native';
import { FONTS, SIZES } from '../../constants';
import Row from '../../components/Row';
import { installWebGeolocationPolyfill } from 'expo-location';
installWebGeolocationPolyfill();
import { MaterialIcons } from '@expo/vector-icons';
import {
    GooglePlaceData,
    GooglePlaceDetail,
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete';

import { CartItem, switchPaymentType } from '../../redux/cartReducer/cartSlide';
import FloatingButton from '../../components/FloatingButton';
import { useNavigation } from '@react-navigation/core';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { MotiView, AnimatePresence } from 'moti';
import InputField from '../../components/InputField';
import { switchOrderType } from '../../redux/cartReducer/cartSlide';
import GoogleAutoComplete from '../../components/GoogleAutoComplete';

const Checkout = () => {
    const dispatch = useAppDispatch();
    const googleRef = useRef<GooglePlacesAutocompleteRef>(null);
    const navigation = useNavigation();
    const { user } = useAppSelector((state) => state.auth);
    const { selectedStore } = useAppSelector((state) => state.stores);
    const { orderType, paymentType } = useAppSelector((state) => state.cart);
    const theme = useAppSelector((state) => state.theme);
    const [address, setAddress] = useState<string>('');
    const [apt, setApt] = useState<string>('');
    const [coords, setCoords] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const { cartItems, cartTotal, itemsCount } = useAppSelector(
        (state) => state.cart
    );

    const getAddress = (data: GooglePlaceData, details: GooglePlaceDetail) => {
        setAddress(details.formatted_address);
        setCoords(details.geometry.location);
    };

    const renderCartItem: ListRenderItem<CartItem> = ({ index, item }) => {
        return <View>{/* <Text>{item.name}</Text> */}</View>;
    };

    if (!user) return <Cart />;
    return (
        <Screen>
            <Row
                verticalAlign="center"
                horizontalAlign="space-between"
                containerStyle={{
                    paddingHorizontal: SIZES.padding * 0.5
                }}
            >
                <FloatingButton
                    iconName="arrow-left"
                    onPress={() => navigation.goBack()}
                />
                <MainText title bold>
                    Check Out
                </MainText>
                <MainText></MainText>
            </Row>
            <KeyboardAwareFlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginTop: 10 }}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View>
                        <Tile
                            style={[
                                styles.tile,
                                {
                                    backgroundColor: theme.CARD_BACKGROUND,
                                    marginTop: 15
                                }
                            ]}
                        >
                            <MainText
                                center
                                bold
                                style={{ color: theme.CARD_BACKGROUND }}
                            >
                                Order Type
                            </MainText>
                            <Divider />
                            <Row
                                horizontalAlign="space-evenly"
                                verticalAlign="center"
                            >
                                <MaterialIcons
                                    name="delivery-dining"
                                    size={30}
                                    color={theme.TEXT_COLOR}
                                />
                                <MainText
                                    capitalize
                                    large
                                    style={{ color: theme.TEXT_COLOR }}
                                >
                                    {orderType}
                                </MainText>
                                {selectedStore?.deliveryType !== 'pickup' && (
                                    <Button
                                        onPress={() => {
                                            console.log(orderType);
                                            if (orderType === 'delivery') {
                                                dispatch(
                                                    switchPaymentType('credit')
                                                );
                                            }
                                            dispatch(
                                                switchOrderType(
                                                    orderType === 'delivery'
                                                        ? 'pickup'
                                                        : 'delivery'
                                                )
                                            );
                                        }}
                                        style={{
                                            backgroundColor: theme.ASCENT
                                        }}
                                        small
                                    >
                                        <MainText lightText bold>
                                            Switch to{' '}
                                            {orderType === 'delivery'
                                                ? 'Pick Up'
                                                : 'Delivery'}
                                        </MainText>
                                    </Button>
                                )}
                            </Row>
                        </Tile>
                        {orderType === 'delivery' && (
                            <Tile
                                style={[
                                    styles.tile,
                                    {
                                        backgroundColor: theme.CARD_BACKGROUND,
                                        marginTop: 15
                                    }
                                ]}
                            >
                                <MainText
                                    center
                                    bold
                                    style={{ color: theme.BACKGROUND_COLOR }}
                                >
                                    Delivery Address
                                </MainText>

                                <Divider />
                                <GoogleAutoComplete
                                    ref={googleRef}
                                    onPress={(
                                        data: GooglePlaceData,
                                        detail: GooglePlaceDetail
                                    ) => {
                                        setAddress(detail.formatted_address);
                                    }}
                                    address={address}
                                    onPressClose={() => {
                                        setAddress('');
                                        setApt('');
                                        googleRef.current?.clear();
                                    }}
                                />
                                <AnimatePresence>
                                    {address !== '' && (
                                        <MotiView
                                            from={{
                                                opacity: 0,
                                                scale: 0.6
                                            }}
                                            exit={{ opacity: 0 }}
                                            animate={{
                                                opacity: address !== '' ? 1 : 0,
                                                scale: address !== '' ? 1 : 0
                                            }}
                                        >
                                            <InputField
                                                placeholder="Apt, Suite, Floor"
                                                value={apt}
                                                onChangeText={(text) => {
                                                    setApt(text.toUpperCase());
                                                }}
                                            />
                                        </MotiView>
                                    )}
                                </AnimatePresence>
                            </Tile>
                        )}
                        <Tile
                            style={[
                                styles.tile,
                                {
                                    backgroundColor: theme.CARD_BACKGROUND,
                                    marginTop: 15
                                }
                            ]}
                        >
                            <MainText bold center>
                                Payment Type
                            </MainText>
                            <Divider />
                            <Row
                                horizontalAlign="space-evenly"
                                verticalAlign="center"
                            >
                                <Button
                                    onPress={() =>
                                        dispatch(switchPaymentType('credit'))
                                    }
                                    style={[
                                        styles.shadow,
                                        {
                                            backgroundColor:
                                                paymentType === 'credit'
                                                    ? theme.ASCENT
                                                    : theme.CARD_BACKGROUND
                                        }
                                    ]}
                                    small
                                >
                                    <MainText
                                        bold
                                        lightText={paymentType === 'credit'}
                                    >
                                        Credit
                                    </MainText>
                                </Button>
                                {orderType !== 'pickup' && (
                                    <Button
                                        onPress={() =>
                                            dispatch(switchPaymentType('cash'))
                                        }
                                        style={[
                                            styles.shadow,
                                            {
                                                backgroundColor:
                                                    paymentType === 'cash'
                                                        ? theme.ASCENT
                                                        : theme.CARD_BACKGROUND
                                            }
                                        ]}
                                        small
                                    >
                                        <MainText
                                            lightText={paymentType === 'cash'}
                                            bold
                                        >
                                            Cash
                                        </MainText>
                                    </Button>
                                )}

                                {orderType === 'pickup' && (
                                    <Button
                                        onPress={() =>
                                            dispatch(
                                                switchPaymentType('in-store')
                                            )
                                        }
                                        style={[
                                            styles.shadow,
                                            {
                                                backgroundColor:
                                                    paymentType === 'in-store'
                                                        ? theme.ASCENT
                                                        : theme.CARD_BACKGROUND
                                            }
                                        ]}
                                        small
                                    >
                                        <MainText
                                            lightText={
                                                paymentType === 'in-store'
                                            }
                                            bold
                                        >
                                            In Store
                                        </MainText>
                                    </Button>
                                )}
                            </Row>
                        </Tile>
                    </View>
                }
                data={cartItems}
                keyExtractor={(item) => item.id!}
                renderItem={renderCartItem}
            />

            <BottomView
                style={[
                    styles.bottomView,
                    {
                        backgroundColor: theme.SECONDARY_BUTTON_COLOR,
                        shadowColor: theme.SHADOW_COLOR
                    }
                ]}
            >
                <Row
                    containerStyle={{
                        width: '100%',
                        padding: SIZES.padding * 0.5
                    }}
                    verticalAlign="center"
                    horizontalAlign="space-evenly"
                >
                    <MainText lightText style={{ ...FONTS.h4 }}>
                        Items: {itemsCount}
                    </MainText>
                    <MainText lightText style={{ ...FONTS.h4 }}>
                        Total: ${cartTotal.toFixed(2)}
                    </MainText>
                </Row>
                <Button
                    onPress={() => {
                        if (orderType === 'delivery' && address.length === 0) {
                            Alert.alert(
                                'Delivery Address',
                                'Please enter an address',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            googleRef.current?.focus();
                                        }
                                    }
                                ]
                            );
                            return;
                        }
                        navigation.navigate('CartStack', {
                            screen: 'OrderReview'
                        });
                    }}
                    small
                >
                    <MainText lightText bold>
                        Review Order
                    </MainText>
                </Button>
            </BottomView>
        </Screen>
    );
};

export default Checkout;

const BottomView = styled.View``;
const Tile = styled.View``;

const styles = StyleSheet.create({
    tile: {
        shadowOffset: {
            height: 6,
            width: 2
        },
        elevation: 6,
        shadowOpacity: 0.6,
        shadowRadius: 6,
        borderRadius: SIZES.radius,
        padding: SIZES.padding * 0.5,
        margin: SIZES.padding * 0.3
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        // left: 0,
        // right: 0,
        width: SIZES.isSmallDevice ? '95%' : SIZES.width / 2,
        alignSelf: 'center',
        minHeight: SIZES.height * 0.1,
        elevation: 6,
        opacity: 0.8,
        shadowOffset: { width: 2, height: 6 },
        shadowOpacity: 0.4,

        alignItems: 'center',

        borderRadius: SIZES.radius * 3,
        margin: SIZES.padding
    },
    shadow: {
        shadowOffset: {
            height: 6,
            width: 2
        },
        elevation: 6,
        shadowOpacity: 0.5,
        shadowRadius: 6,
        borderRadius: SIZES.radius * 3
    }
});
