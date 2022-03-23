import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, ListRenderItem, View } from 'react-native';
import { Loader, RestaurantCard, Screen, MainText } from '../../components';

import RestaurantSearch from '../../components/RestaurantSearch';
import Toogler from '../../components/Toogler';
import { SIZES } from '../../constants';
import { useStores } from '../../hooks/useStores';
import { switchOrderType } from '../../redux/cartReducer/cartSlide';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getStore } from '../../redux/storesReducer/storesActions';
import { Store } from '../../redux/storesReducer/storesSlide';
import { RestaurantsStackParamList } from '../../types';

const SPACING = SIZES.padding;
const ITEM_SIZE = SIZES.height * 0.25 + SPACING * 2;

type Props = NativeStackScreenProps<RestaurantsStackParamList, 'Restaurants'>;

const Restaurants: FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();

    const { orderType } = useAppSelector((state) => state.cart);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [searchText, setSearchText] = useState('');
    const { loading, stores } = useStores();
    //useAllProducts();

    const prepareProductsForNextScreen = (storeId: string) => {
        if (storeId) {
            dispatch(getStore(storeId));
        }
    };

    const renderRestaurants: ListRenderItem<Store> = ({ item, index }) => {
        const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)];
        const opacityRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 1)
        ];
        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
        });
        const opacity = scrollY.interpolate({
            inputRange: opacityRange,
            outputRange: [1, 1, 1, 0]
        });
        return (
            <RestaurantCard
                scale={scale}
                opacity={opacity}
                restaurant={item}
                onPress={() => {
                    prepareProductsForNextScreen(item.id);
                    navigation.navigate('Restaurant', {
                        restaurantId: item.id
                    });
                }}
            />
        );
    };

    if (loading) return <Loader />;
    return (
        <Screen>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <RestaurantSearch
                    onPressSearch={({ nativeEvent }) => {
                        console.log(nativeEvent.key);
                    }}
                    onPressClearButton={() => {
                        setSearchText('');
                        Keyboard.dismiss();
                    }}
                    onChangeText={(text) => {
                        setSearchText(text);
                    }}
                    searchText={searchText}
                />
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Toogler
                        leftCondition="delivery"
                        rightCondition="pickup"
                        condition={orderType}
                        onPressLeft={() =>
                            dispatch(switchOrderType('delivery'))
                        }
                        onPressRight={() => dispatch(switchOrderType('pickup'))}
                    />
                </View>
            </View>
            {stores && (
                <Animated.FlatList
                    numColumns={SIZES.isSmallDevice ? 1 : 2}
                    ListHeaderComponent={
                        <View
                            style={{
                                width: SIZES.width * 0.9,
                                marginTop: SIZES.padding
                            }}
                        >
                            <MainText style={{ textAlign: 'left' }}>
                                Restaurants
                            </MainText>
                        </View>
                    }
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center' }}
                    data={stores}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderRestaurants}
                />
            )}
        </Screen>
    );
};

export default Restaurants;
