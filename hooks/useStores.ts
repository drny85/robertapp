import { useCallback, useEffect, useState } from 'react';

import { db } from '../firebase';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { getStores } from '../redux/storesReducer/storesSlide';

export const useStores = () => {
    const { stores } = useAppSelector((state) => state.stores);
    const { orderType } = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    const deliveryType = useCallback(
        (t: typeof orderType) => {
            if (t === 'pickup') return ['pickupOnly'];
            return ['delivery', 'both'];
        },
        [orderType]
    );
    console.log('Loading Stores...');

    useEffect(() => {
        const snap = db
            .collection('stores')
            .where('status', '==', 'approved')
            .where('hasItems', '==', true)
            .where('deliveryType', 'in', deliveryType(orderType))
            .onSnapshot((snapshot) => {
                dispatch(
                    getStores(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                    )
                );
            });

        setLoading(false);

        return snap;
    }, [dispatch, orderType]);

    return { stores, loading };
};
