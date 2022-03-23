import {
    Alert,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React, { FC } from 'react';
import { MainText } from '.';
import { SIZES } from '../constants';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { Product } from '../redux/productsReducer/productsSlide';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/core';
import Shopper from './Shopper';
import {
    addToCart,
    clearCart,
    deleteFromCart
} from '../redux/cartReducer/cartActions';

interface Props {
    product: Product;
    onPress: () => void;
}
const ProductCard: FC<Props> = ({ product, onPress }): JSX.Element => {
    const { cartItems } = useAppSelector((state) => state.cart);
    const { selectedStore } = useAppSelector((state) => state.stores);
    const dispatch = useAppDispatch();
    const productInCart = cartItems.find((p) => product.id === p.id);
    const isFromAnotherStore = async (): Promise<boolean> => {
        try {
            if (cartItems.length > 0) {
                const found = cartItems.find(
                    (i) => i.storeId === selectedStore?.id
                );
                return !found ? true : false;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const deleteAndAdd = async () => {
        try {
            const { payload } = await dispatch(clearCart());

            if (payload) {
                await dispatch(
                    addToCart({
                        ...product,
                        size: null,
                        quantity: 1,
                        instruction: null
                    })
                );
            }

            return;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: '#646262a6',
                    width: SIZES.isSmallDevice
                        ? SIZES.width * 0.7
                        : SIZES.width * 0.4
                }
            ]}
        >
            <ImageBackground
                resizeMode="cover"
                source={{ uri: product.imageUrl }}
                style={styles.image}
            >
                {cartItems.find((i) => i.id === product.id) && (
                    <LinearGradient
                        start={{ y: 0.3, x: 0.0 }}
                        colors={['transparent', '#948c8c56', '#64616157']}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            padding: SIZES.padding * 0.2
                        }}
                    >
                        <MainText lightText bold>
                            In Cart
                        </MainText>
                    </LinearGradient>
                )}

                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                    {product.sizes === null && (
                        <Shopper
                            value={productInCart?.quantity!}
                            onAdd={async () => {
                                const anotherStore = await isFromAnotherStore();
                                if (anotherStore) {
                                    Alert.alert('Another Item Found', `dsdsd`, [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Delete & Add New Item',
                                            onPress: deleteAndAdd
                                        }
                                    ]);

                                    return;
                                }
                                dispatch(
                                    addToCart({
                                        ...product,

                                        size: null,
                                        quantity: productInCart?.quantity || 1,
                                        instruction: null
                                    })
                                );
                            }}
                            onDelete={() => {
                                dispatch(
                                    deleteFromCart({
                                        ...product,
                                        size: productInCart?.size!,
                                        sizes: productInCart?.sizes!,
                                        quantity: productInCart?.quantity!,
                                        instruction: null
                                    })
                                );
                            }}
                        />
                    )}
                </View>
                <View style={styles.left}>
                    <MainText capitalize lightText lobster>
                        {product.name}
                    </MainText>
                    <MainText lightText capitalize bold>
                        $
                        {product.sizes !== null
                            ? product.price[product.sizes[0]]
                            : product.price}
                    </MainText>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        marginHorizontal: SIZES.padding * 0.2,
        height: SIZES.height * 0.2,
        borderRadius: SIZES.radius
    },
    image: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: SIZES.radius
    },
    left: {
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: SIZES.padding * 0.5,
        paddingHorizontal: SIZES.base,
        backgroundColor: '#646262a6'
    }
});
