import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { FC, useState, useCallback } from 'react';

import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { useAppSelector } from '../redux/store';
import { useNetInfo } from '@react-native-community/netinfo';
import { functions } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import { Screen } from '.';

interface Props {
    cartTotal: string;
    cartId: string;
}

const PaymentScreen: FC<Props> = ({ cartId, cartTotal, children }) => {
    const theme = useAppSelector((state) => state.theme);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const navigation = useNavigation();
    const { isConnected, isInternetReachable } = useNetInfo();
    const [proccessing, setProccessing] = useState<boolean>(false);

    const initializePaymentSheet = useCallback(async () => {
        try {
            if (isConnected && isInternetReachable) {
                const functionRef = functions.httpsCallable(
                    'createPaymentIntent'
                );

                setProccessing(true);
                const { data } = await functionRef({
                    cartId,
                    cartTotal
                });

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
            console.log('E', error.details.message);
        } finally {
            setProccessing(false);
        }
    }, [isInternetReachable]);

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();
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
            <Screen>{children}</Screen>
        </StripeProvider>
    );
};

export default PaymentScreen;

const styles = StyleSheet.create({});
