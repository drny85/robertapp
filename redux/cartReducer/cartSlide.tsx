import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../productsReducer/productsSlide';
import {
    addToCart,
    Cart,
    clearCart,
    deleteFromCart,
    getCartItems
} from './cartActions';

export interface CartItem extends Product {
    size?: null | string;
    quantity: number;
    instruction: string | null;
}

export interface CartState {
    cartItems: CartItem[];
    cartTotal: number;
    loading: boolean;
    itemsCount: number;
    counts: number;
    InCart: boolean;
    deliveryAddress: string | null;
    paymentType: 'credit' | 'cash' | 'in-store';
    orderType: 'delivery' | 'pickup';
}
const initialState: CartState = {
    cartItems: [],
    loading: false,
    cartTotal: 0,
    counts: 0,
    deliveryAddress: null,
    InCart: false,
    paymentType: 'credit',
    orderType: 'delivery',
    itemsCount: 0
};
const cartSlide = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        calculateCartTotal: (
            state,
            { payload: { items, quantity, total } }: PayloadAction<Cart>
        ) => {
            const t = items.reduce(
                (current, index) => current + index.price * index.quantity,
                0
            );
            const counts = items.reduce(
                (current, index) => current + index.quantity,
                0
            );
            state.cartTotal = t;
            state.itemsCount = quantity;
            state.counts = counts;
        },
        setIsIncart: (state, { payload }: PayloadAction<string>) => {
            state.InCart =
                state.cartItems.findIndex((i) => i.id === payload) === -1;
        },
        resetCartState: (state) => {
            return initialState;
        },
        switchOrderType: (
            state,
            { payload }: PayloadAction<CartState['orderType']>
        ) => {
            state.loading = false;
            state.orderType = payload;
        },
        switchPaymentType: (
            state,
            { payload }: PayloadAction<CartState['paymentType']>
        ) => {
            state.paymentType = payload;
        },
        setDeliveryAddress: (
            state,
            { payload }: PayloadAction<CartState['deliveryAddress']>
        ) => {
            state.deliveryAddress = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.rejected, (state) => {
                state.loading = false;
            })
            .addCase(
                addToCart.fulfilled,
                (
                    state,
                    { payload: { items, quantity, total } }: PayloadAction<Cart>
                ) => {
                    state.loading = false;
                    state.itemsCount = quantity;
                    state.cartItems = items;
                    state.cartTotal = total;
                }
            )
            .addCase(getCartItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCartItems.rejected, (state) => {
                state.loading = false;
            })
            .addCase(
                getCartItems.fulfilled,
                (
                    state,
                    { payload: { items, quantity, total } }: PayloadAction<Cart>
                ) => {
                    state.loading = false;
                    state.itemsCount = quantity;
                    state.cartItems = items.sort((a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0
                    )!;
                    state.cartTotal = total;
                }
            )
            .addCase(deleteFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteFromCart.rejected, (state, { payload }) => {
                state.loading = false;
                console.log('Error', payload);
            })
            .addCase(deleteFromCart.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.cartItems = payload?.items.sort((a, b) =>
                    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0
                )!;
                state.cartTotal = payload?.total!;
                state.itemsCount = payload?.quantity!;
            });
    }
});

export const {
    calculateCartTotal,
    resetCartState,
    switchOrderType,
    switchPaymentType,
    setDeliveryAddress
} = cartSlide.actions;

export default cartSlide.reducer;
