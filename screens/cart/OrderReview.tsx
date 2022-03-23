import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { FC, useState, useCallback } from 'react';

import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { useAppSelector } from '../../redux/store';
import { useNetInfo } from '@react-native-community/netinfo';
import { functions } from '../../firebase';
import { useNavigation } from '@react-navigation/core';
import { Button, Screen } from '../../components';

interface Props {
    cartTotal: string;
    cartId: string;
}

const OrderReview = () => {
    const theme = useAppSelector((state) => state.theme);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const navigation = useNavigation();
    const { cartItems, cartTotal } = useAppSelector((state) => state.cart);
    const { isConnected, isInternetReachable } = useNetInfo();
    const [proccessing, setProccessing] = useState<boolean>(false);
    console.log(proccessing);

    const initializePaymentSheet = useCallback(async () => {
        try {
            if (isConnected && isInternetReachable) {
                const functionRef = functions.httpsCallable(
                    'createPaymentIntent'
                );

                setProccessing(true);
                const { data } = await functionRef({
                    cartTotal
                });
                console.log(data);

                if (!data.success) {
                    //@ts-ignore
                    alert('No data available');
                    return;
                }
                const { customer, ephemeralKey, paymentIntent } = data.result;

                const { error } = await initPaymentSheet({
                    customerId: customer,
                    customerEphemeralKeySecret: ephemeralKey,
                    paymentIntentClientSecret: paymentIntent
                });

                if (error) {
                    console.log('Error @', error);
                } else {
                    setProccessing(false);
                    openPaymentSheet();
                }
            } else {
                //@ts-ignore
                alert('Internet connection issues');
                return;
            }
        } catch (error: any) {
            console.log('E', error.message);
        } finally {
            setProccessing(false);
        }
    }, [isInternetReachable]);

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet({
                clientSecret: process.env.STRIPE_TEST_KEY
            });
            if (error) {
                Alert.alert(`${error.code}`, error.message);
                return;
            } else {
                console.log('Payment Success');
                navigation.navigate('CartStack', { screen: 'PaymentSuccess' });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <StripeProvider
            publishableKey={process.env.STRIPE_TEST_KEY!}
            merchantIdentifier={'merchant.dev.robertdev.melendez-ant.dev'}
            threeDSecureParams={{
                timeout: 8,
                backgroundColor: theme.BACKGROUND_COLOR
            }}
        >
            <Screen>
                <Button onPress={initializePaymentSheet}>
                    <Text>Pay {cartTotal}</Text>
                </Button>
            </Screen>
        </StripeProvider>
    );
};

export default OrderReview;

const styles = StyleSheet.create({});
