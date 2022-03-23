import { ImageBackground, StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { MainText } from '../../components';
import CheckBox from '../../components/CkeckBox';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RestaurantsStackParamList } from '../../types';
import { setProduct } from '../../redux/productsReducer/productsSlide';
import { FONTS, SIZES } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import Shopper from '../../components/Shopper';
import FloatingButton from '../../components/FloatingButton';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
    addToCart,
    clearCart,
    deleteFromCart
} from '../../redux/cartReducer/cartActions';
import InputField from '../../components/InputField';
import { CartItem } from '../../redux/cartReducer/cartSlide';
import Animated, {
    Easing,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<
    RestaurantsStackParamList,
    'ProductDetails'
>;
const ProductDetails: FC<Props> = ({ navigation, route }) => {
    const { product } = useAppSelector((state) => state.products);
    const theme = useAppSelector((state) => state.theme);
    const { cartItems, InCart } = useAppSelector((state) => state.cart);
    const [checked, setChecked] = useState<boolean | any>(false);
    const [instruction, setInstrction] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const sizes: string[] = [];
    const opacityValue = useSharedValue(0);
    const productInCart = cartItems.find((p) => p.id === product?.id);

    const unitInCart = (s: string) => {
        const index = cartItems.findIndex(
            (i) => i.id === product?.id && i.size === checked && checked === s
        );
        if (index === -1) {
            return null;
        } else {
            opacityValue.value = withTiming(0.8, {
                duration: 800,
                easing: Easing.ease
            });
            return cartItems[index].quantity;
        }
    };

    const handleCheck = (item: string) => {
        //add size to the array just once;
        const found = sizes.find((i) => i === item);
        if (found) return;
        const index = sizes.findIndex((i) => i === item);
        sizes.splice(index, 1);

        sizes.push(item);
        setChecked(item);
    };

    const handleAddToCart = async () => {
        try {
            if (cartItems.length > 0) {
                const found = cartItems.find(
                    (p) => p.storeId === product?.storeId
                );
                if (!found) {
                    await deleteAndAdd();
                    navigation.goBack();
                    return;
                } else {
                    const newItem: CartItem = {
                        ...product!,
                        size: checked ? checked : null,
                        quantity: 1,
                        price:
                            product?.sizes === null
                                ? +product.price
                                : +product?.price[checked],
                        instruction: instruction
                    };

                    const added = await dispatch(addToCart(newItem));
                    if (
                        added.type === 'cart/addToCart/fulfilled' &&
                        product?.sizes !== null
                    ) {
                        navigation.goBack();
                    }
                }
            } else {
                const newItem: CartItem = {
                    ...product!,
                    size: checked ? checked : null,
                    quantity: productInCart ? productInCart.quantity : 1,
                    price:
                        product?.sizes === null
                            ? +product.price
                            : +product?.price[checked],
                    instruction: instruction
                };
                const added = await dispatch(addToCart(newItem));
                if (
                    added.type === 'cart/addToCart/fulfilled' &&
                    product?.sizes !== null
                ) {
                    navigation.goBack();
                }
            }
        } catch (error) {
            console.log('ERROR ADDING TO CART', error);
        }
    };

    const handleRemoveOneFromCart = async () => {
        await dispatch(
            deleteFromCart({
                ...productInCart!
            })
        );
    };

    const deleteAndAdd = async () => {
        try {
            const deleted = await dispatch(clearCart());

            if (deleted.payload) {
                await dispatch(
                    addToCart({
                        ...product!,
                        size: checked ? checked : null,
                        instruction: instruction,
                        quantity: productInCart ? productInCart.quantity : 1,
                        price:
                            product?.sizes === null
                                ? product.price
                                : product?.price[checked]
                    })
                );
            }

            return;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        dispatch(setProduct(route.params.productId));

        return () => {
            // dispatch(getStores([]))
            // dispatch(setSelectedStore(null))
        };
    }, [route.params.productId, dispatch]);
    return (
        <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
            <ImageBackground
                style={styles.image}
                resizeMode="cover"
                source={{ uri: product?.imageUrl }}
            >
                <FloatingButton
                    containerStyle={{
                        position: 'absolute',
                        top: 40,
                        left: 20,
                        zIndex: 99
                    }}
                    onPress={() => navigation.goBack()}
                    iconName="arrow-left"
                />
                <LinearGradient
                    style={styles.gradient}
                    locations={[0.2, 0.4, 1]}
                    colors={[
                        '#57535399',
                        theme.SHADOW_COLOR,
                        theme.SECONDARY_BUTTON_COLOR
                    ]}
                >
                    <MainText
                        style={{
                            fontFamily: 'lobster',
                            fontSize: 24,
                            color: theme.WHITE_COLOR
                        }}
                    >
                        {product?.name}
                    </MainText>
                    <MainText style={{ ...FONTS.h3, color: theme.WHITE_COLOR }}>
                        {product?.sizes && checked
                            ? `$${product.price[checked]}`
                            : null}
                        {product?.sizes && !checked
                            ? `$${product?.price[product.sizes[0]]!} - $${
                                  product.price[
                                      product.sizes[product.sizes.length - 1]!
                                  ]
                              }`
                            : null}
                        {!product?.sizes && `$${product?.price}`}
                    </MainText>
                </LinearGradient>
                {product?.sizes === null && (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -20,
                            justifyContent: 'center',
                            width: SIZES.width,
                            flexDirection: 'row',
                            zIndex: 110
                        }}
                    >
                        <Shopper
                            value={productInCart ? productInCart.quantity : 0}
                            onAdd={handleAddToCart}
                            onDelete={handleRemoveOneFromCart}
                        />
                    </View>
                )}
            </ImageBackground>
            {/* <Shopper
				value={count}
				onAdd={() => setCount(count + 1)}
				onDelete={() => setCount(count - 1)}
			/> */}
            <KeyboardAwareScrollView
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ flex: 1 }}
            >
                <DescriptionView style={styles.description}>
                    <MainText style={{ ...FONTS.body2, fontFamily: 'lobster' }}>
                        {product?.description}
                    </MainText>
                </DescriptionView>
                {product?.sizes && (
                    <>
                        <MainText
                            style={{
                                ...FONTS.h4,
                                textAlign: 'center',
                                paddingBottom: 10
                            }}
                        >
                            Pick a Size
                        </MainText>
                        <Animated.View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'flex-end'
                            }}
                        >
                            {product.sizes.map((s) => (
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    key={s}
                                >
                                    {unitInCart(s) !== null && (
                                        <Animated.Text
                                            style={[
                                                {
                                                    ...FONTS.body5,
                                                    opacity: opacityValue.value
                                                }
                                            ]}
                                        >
                                            {unitInCart(s)} in cart
                                        </Animated.Text>
                                    )}

                                    <Animated.View key={s}>
                                        <CheckBox
                                            title={s}
                                            onPress={() => handleCheck(s)}
                                            checked={checked === s}
                                        />
                                    </Animated.View>
                                </View>
                            ))}
                        </Animated.View>
                    </>
                )}
                <InstructionView
                    style={{
                        width: SIZES.width * 0.95,
                        justifyContent: 'center',
                        alignContent: 'center',
                        padding: 10,
                        marginTop: 15
                    }}
                >
                    <InputField
                        label="Instruction"
                        containerStyle={{ borderRadius: 15, ...FONTS.body4 }}
                        errorStyle={{ color: theme.SHADOW_COLOR }}
                        errorMessage={
                            instruction && instruction?.length > 0
                                ? `${instruction?.length} / 150`
                                : ''
                        }
                        maxLenght={150}
                        value={instruction!}
                        onChangeText={setInstrction}
                        multiline={true}
                        placeholder="Dressing on the side? any request on this item, please let us know here."
                    />
                </InstructionView>
            </KeyboardAwareScrollView>
            {product?.sizes !== null && (
                <AddToCartButton
                    onPress={handleAddToCart}
                    disabled={product?.sizes !== null && !checked}
                    style={[
                        styles.addToCartBtn,
                        {
                            backgroundColor:
                                product?.sizes !== null && !checked
                                    ? theme.SHADOW_COLOR
                                    : theme.PRIMARY_BUTTON_COLOR
                        }
                    ]}
                >
                    <MainText lightText bold>
                        Add To Cart
                    </MainText>
                </AddToCartButton>
            )}
        </View>
    );
};

export default ProductDetails;

const DescriptionView = styled.View``;
const SizesView = styled.View``;
const SizeView = styled.View``;
const InstructionView = styled.View``;
const AddToCartButton = styled.TouchableOpacity``;

const styles = StyleSheet.create({
    image: {
        width: SIZES.width,
        height: SIZES.height * 0.25,
        marginBottom: SIZES.padding
    },
    addToCartBtn: {
        position: 'absolute',
        bottom: SIZES.padding,
        paddingHorizontal: SIZES.padding,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: SIZES.radius * 2
    },

    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SIZES.padding * 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    description: {
        padding: SIZES.padding * 0.5
    }
});
