import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
//import fetch from 'node-fetch';

dotenv.config();

import Stripe from 'stripe';
//import { UserRecord } from 'firebase-functions/v1/auth';
const stripe = new Stripe(process.env.STRIPE_TEST_KEY!, {
    apiVersion: '2020-08-27'
});

admin.initializeApp();

interface response {
    success: boolean;
    result: any;
}

exports.createStripeCustomer = functions.firestore
    .document('/users/{userId}')
    .onWrite(async (change, context) => {
        try {
            const data = change.after.data();
            if (data === null) {
                return null;
            }
            const email = data?.email;
            const name = data?.name + ' ' + data?.lastName;
            const customer = await stripe.customers.create({
                email: email,
                name: name,
                phone: data?.phone
            });
            return await admin
                .firestore()
                .collection('stripe_customers')
                .doc(context.params.userId)
                .set({ customer_id: customer.id });
        } catch (error) {
            throw new functions.https.HttpsError(
                'aborted',
                'error while creating stripe customer'
            );
        }
    });

exports.makeMeDeveloper = functions.auth.user().onCreate(async (user) => {
    try {
        if (user.email && user.email === 'melendez@robertdev.net') {
            return grantAdminAccess(user.email).then(() => {
                return admin
                    .firestore()
                    .collection('users')
                    .doc(user.uid)
                    .update({ isActive: true, role: 'developer' });
            });
        } else {
            if (user.email) {
                return admin.auth().setCustomUserClaims(user.uid, {
                    role: 'user'
                });
            }
        }
    } catch (error) {
        throw new functions.https.HttpsError(
            'aborted',
            'error while making admin',
            error
        );
    }
});

async function grantAdminAccess(email: string) {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && user.customClaims.role === 'developer') return;

    return admin.auth().setCustomUserClaims(user.uid, {
        role: 'admin',
        accessLevel: 10
    });
}

exports.createPaymentIntent = functions.https.onCall(
    async (
        data: { cartTotal: number },
        context: functions.https.CallableContext
    ): Promise<response> => {
        try {
            if (!context.auth)
                return { success: false, result: 'Not authotized' };
            const email = context.auth?.token.email;
            const uid = context.auth.uid;

            const stripeCustomerObject = await admin
                .firestore()
                .collection('stripe_customers')
                .doc(uid)
                .get();
            const customer_id = await stripeCustomerObject.data()?.customer_id;
            console.log('ID', customer_id);
            if (!customer_id)
                return { success: false, result: 'no customer id found' };

            if (data.cartTotal < 1) {
                return {
                    success: false,
                    result: `amount to small ${data.cartTotal}`
                };
            }

            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer_id },
                { apiVersion: '2020-08-27' }
            );
            const paymentIntent = await stripe.paymentIntents.create({
                customer: customer_id,
                payment_method_types: ['card'],
                amount: Math.round(data.cartTotal * 100),
                currency: 'usd',
                receipt_email: email,
                application_fee_amount: Math.round(data.cartTotal) * 0.08 * 100,
                transfer_data: {
                    destination: 'acct_1KfosI2HAGJLPlLM'
                },

                metadata: {
                    customerId: uid
                }
            });

            return {
                success: true,
                result: {
                    paymentIntent: paymentIntent.client_secret,
                    ephemeralKey: ephemeralKey.secret,
                    customer: customer_id,
                    paymentId: paymentIntent.id
                }
            };
        } catch (error) {
            console.log('ERROR', error);
            const err = error as any;
            throw new functions.https.HttpsError(
                'aborted',
                'error ocuured in payment intent',
                err.message
            );
        }
    }
);
