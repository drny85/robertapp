import React from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../firebase';

import {
    calculateCartTotal,
    CartItem,
    CartState,
    resetCartState
} from './cartSlide';
import Cart from '../../screens/cart/Cart';

export interface Cart {
    items: CartItem[];
    quantity: number;
    total: number;
}

const CART_ID = '@cartId';

export const getCartOrCreateCart = createAsyncThunk(
    'cart/getOrCreateCart',
    async (_, { rejectWithValue }): Promise<string | undefined> => {
        try {
            const cartId = await AsyncStorage.getItem(CART_ID);

            if (cartId !== null) {
                // CART ID FOUND - VERIFY IF EXIST
                const cartRef = await db
                    .collection('carts')
                    .doc(JSON.parse(cartId))
                    .get();

                if (cartRef.data() !== undefined) {
                    return cartRef.ref.id;
                } else {
                    //await AsyncStorage.removeItem(CART_ID)

                    const newCartRef = await db
                        .collection('carts')
                        .add({ items: [], quantity: 0, total: 0 });
                    await AsyncStorage.setItem(
                        CART_ID,
                        JSON.stringify(newCartRef.id)
                    );
                    return newCartRef.id;
                }
            } else {
                //   CART ID NOT FOUND - CREATE A CART AND SAVE IN LOCAL STORAGE

                if (cartId === null) {
                    const newCartRef = await db
                        .collection('carts')
                        .add({ items: [], quantity: 0, total: 0 });
                    await AsyncStorage.setItem(
                        CART_ID,
                        JSON.stringify(newCartRef.id)
                    );
                    return newCartRef.id;
                }
            }
        } catch (error) {
            rejectWithValue(error);
            return undefined;
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (product: CartItem, { rejectWithValue, dispatch }) => {
        try {
            const { payload } = await dispatch(getCartOrCreateCart());
            const cartId = payload as string;

            const data = db.collection('carts').doc(cartId);
            const { items, quantity, total } = (
                await data.get()
            ).data() as Cart;

            const result = await checkIfProductComeInSizes(
                product,
                items,
                quantity,
                total,
                cartId
            );

            return result as Cart;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteFromCart = createAsyncThunk(
    'cart/deleteFromCart',
    async (product: CartItem, { rejectWithValue, dispatch }) => {
        try {
            const { payload: p } = await dispatch(getCartOrCreateCart());
            const cartId = p as string;
            const { payload } = await dispatch(getCartItems());
            const { items, quantity, total } = payload as Cart;

            if (items.length === 0) return;
            if (product.size !== null) {
                //DEAL WITH A PRODUCT THAT COMES IN SIZES
                const itemFound = items.find(
                    (i) => i.id === product.id && i.size === product.size
                );
                if (itemFound) {
                    //DEAL WITH ITEM FOUND
                    const size = itemFound.quantity;

                    if (size > 1) {
                        const newItems = [
                            ...items.map((i) =>
                                i.id === product.id && i.size === product.size
                                    ? { ...i, quantity: itemFound.quantity - 1 }
                                    : i
                            )
                        ];

                        return await removeOneMoreToCart(
                            newItems,
                            quantity - 1,
                            total - product.price,
                            cartId!
                        );
                    } else {
                        const index = items.findIndex(
                            (i) =>
                                i.id === product.id && i.size === product.size
                        );
                        const updatedItems = [...items];
                        updatedItems.splice(index, 1);
                        return await removeOneMoreToCart(
                            updatedItems,
                            quantity - 1,
                            total - product.price,
                            cartId!
                        );
                    }
                } else {
                    return rejectWithValue('No Product Found');
                }
            } else {
                const itemFound = items.find((i) => i.id === product.id);

                if (itemFound) {
                    const size = itemFound.quantity;
                    if (size > 1) {
                        const updatedItems = [
                            ...items.map((i) =>
                                i.id === itemFound.id
                                    ? {
                                          ...i,
                                          quantity: itemFound.quantity - 1
                                      }
                                    : i
                            )
                        ];
                        return await removeOneMoreToCart(
                            updatedItems,
                            quantity - 1,
                            total - itemFound.price,
                            cartId!
                        );
                    } else {
                        const index = items.findIndex(
                            (i) => i.id === product.id
                        );
                        const updatedItems = [...items];
                        updatedItems.splice(index, 1);
                        return await removeOneMoreToCart(
                            updatedItems,
                            quantity - 1,
                            total - product.price,
                            cartId!
                        );
                    }
                } else {
                    rejectWithValue('No product found');
                }
            }

            const ref = await db.collection('carts').doc(cartId).get();

            return ref.data() as Cart;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getCartItems = createAsyncThunk(
    'cart/getCartItems',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const { payload: p } = await dispatch(getCartOrCreateCart());
            const cartId = p as string;

            const data = (
                await db.collection('carts').doc(cartId).get()
            ).data() as Cart;

            return data as Cart;
        } catch (error) {
            console.log('EE', error);
            return rejectWithValue(error);
        }
    }
);

export const clearCart = createAsyncThunk(
    '',
    async (_, { dispatch, rejectWithValue }): Promise<boolean> => {
        try {
            const data = await AsyncStorage.getItem(CART_ID);

            if (data !== null) {
                const ref = db.collection('carts').doc(data);
                await ref.delete();
                await AsyncStorage.removeItem(CART_ID);
                dispatch(resetCartState());
                return true;
            } else {
                return false;
            }
        } catch (error) {
            rejectWithValue(error);
            return false;
        }
    }
);
const checkIfProductComeInSizes = async (
    product: CartItem,
    products: CartItem[],
    quantity: number,
    total: number,
    cartId: string
) => {
    try {
        if (product.size) {
            const found = products.find(
                (i) => i.id === product.id && i.size === product.size
            );
            if (found) {
                const newItems = [
                    ...products.map((i) =>
                        i.id === found.id && i.size === product.size
                            ? { ...i, quantity: found.quantity + 1 }
                            : i
                    )
                ];

                const cartToUpdate: Cart = {
                    items: newItems,
                    quantity: quantity + 1,
                    total: +parseFloat(total + product.price).toFixed(2)
                };

                return await addOneMoreToCart(cartToUpdate, cartId);
            } else {
                const cartToUpdate: Cart = {
                    items: [...products, product],
                    quantity: quantity + 1,
                    total: +parseFloat(total + product.price).toFixed(2)
                };
                return await addOneMoreToCart(cartToUpdate, cartId);
            }
        } else {
            // ITEM DO NOT COME IN SIZES
            console.log('NO SIZE');
            const itemFound = products.find((i) => i.id === product.id);
            if (itemFound) {
                const index = products.indexOf(itemFound);
                const newItems = [...products];
                newItems[index].quantity = itemFound.quantity + 1;
                const cartToUpdate: Cart = {
                    items: newItems,
                    quantity: quantity + 1,
                    total: +parseFloat(total + product.price).toFixed(2)
                };
                return await addOneMoreToCart(cartToUpdate, cartId);
            } else {
                const cartToUpdate: Cart = {
                    items: [...products, product],
                    quantity: quantity + 1,
                    total: +parseFloat(total + product.price).toFixed(2)
                };

                return await addOneMoreToCart(cartToUpdate, cartId);
            }
        }
    } catch (error) {
        console.log('E on checkIfProductComeInSizes:', error);
        return error;
    }
};

const addOneMoreToCart = async (cardItems: Cart, cardId: string) => {
    try {
        const ref = db.collection('carts').doc(cardId);
        await ref.update({
            ...cardItems
        });

        const data = (await ref.get()).data() as Cart;

        return data;
    } catch (error) {
        console.log(error);
    }
};

const removeOneMoreToCart = async (
    items: CartItem[],
    quantity: number,
    total: number,
    cardId: string
) => {
    try {
        const ref = await db.collection('carts').doc(cardId);
        await ref.update({
            items,
            quantity,
            total
        });

        const data = (await ref.get()).data() as Cart;
        return data;
    } catch (error) {
        console.log(error);
    }
};
