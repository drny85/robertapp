import { StyleSheet, Animated, ListRenderItem, View } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Screen, MainText } from '../../components';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { db } from '../../firebase';
import {
    getMorePopular,
    getProductsByRestaurantId,
    Product
} from '../../redux/productsReducer/productsSlide';
import {
    getStores,
    setSelectedStore
} from '../../redux/storesReducer/storesSlide';
import Loader from '../../components/Loader';
import { FONTS, SIZES } from '../../constants';
import styled from 'styled-components/native';
import MostPouplarItem from '../../components/MostPopularItem';
import Header from '../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RestaurantsStackParamList } from '../../types';
import {
    Category,
    getCategoriesByStore
} from '../../redux/categoryReducer/categoriesSlide';
import Shopper from '../../components/Shopper';
import ProductCard from '../../components/ProductCard';
import MostPopularView from '../../components/MostPopularView';
import { getStore } from '../../redux/storesReducer/storesActions';

type Props = NativeStackScreenProps<RestaurantsStackParamList, 'Restaurant'>;
const Restaurant: FC<Props> = ({ navigation }) => {
    const { selectedStore } = useAppSelector((state) => state.stores);
    const { categories } = useAppSelector((state) => state.categories);
    const { products, mostPopular } = useAppSelector((state) => state.products);
    const { itemsCount } = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState(true);

    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const [currentX, setCurrentX] = useState<number>(0);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentX(viewableItems[0].index);
        }
    }).current;

    const renderMostPopular: ListRenderItem<Product> = ({ index, item }) => {
        return <MostPouplarItem item={item} onPress={() => {}} />;
    };

    const renderItems: ListRenderItem<Product> = ({ index, item }) => {
        return (
            <ProductCard
                product={item}
                onPress={() =>
                    navigation.navigate('ProductDetails', {
                        productId: item.id!
                    })
                }
            />
        );
    };

    const renderCategories: ListRenderItem<Category> = ({ index, item }) => {
        return products.filter((p) => p.category === item.id).length > 0 ? (
            <View>
                <View
                    style={{
                        paddingVertical: SIZES.padding * 0.2,
                        paddingLeft: 10,
                        flexDirection: 'row'
                    }}
                >
                    <MainText
                        style={{
                            ...FONTS.h4,
                            textTransform: 'capitalize',
                            paddingRight: 5
                        }}
                    >
                        {item.name}
                    </MainText>
                    <MainText style={{ ...FONTS.body4 }}>
                        ({products.filter((i) => i.category === item.id).length}
                        )
                    </MainText>
                </View>
                <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    data={products.filter((p) => p.category === item.id)}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderItems}
                />
                <View style={{ marginBottom: 20 }} />
            </View>
        ) : null;
    };

    useEffect(() => {
        setLoading(true);

        const prodSub = db
            .collection('items')
            .doc(selectedStore?.id)
            .collection('items')
            .where('available', '==', true)
            .onSnapshot((snapshot) => {
                dispatch(
                    getProductsByRestaurantId(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                    )
                );
                dispatch(
                    getMorePopular(
                        snapshot.docs.map(
                            (doc) => ({ id: doc.id, ...doc.data() } as Product)
                        )
                    )
                );
            });

        const catSub = db
            .collection('categories')
            .doc(selectedStore?.id)
            .collection('categories')
            .onSnapshot((snapshot) =>
                dispatch(
                    getCategoriesByStore(
                        snapshot.docs.map(
                            (doc) => ({ id: doc.id, ...doc.data() } as Category)
                        )
                    )
                )
            );
        setLoading(false);

        return () => {
            console.log('Leaving REstaurant');

            catSub();
            prodSub();
        };
    }, [selectedStore?.id, dispatch]);

    if (products.length === 0 || categories.length === 0 || loading)
        return <Loader />;

    return (
        <Screen containerStyle={{ paddingHorizontal: 10 }}>
            <Header
                cartItemsCount={itemsCount}
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate('CartStack', { screen: 'Cart' });
                }}
                onPressBack={() => navigation.goBack()}
            >
                <MainText
                    style={{
                        textTransform: 'capitalize',
                        fontFamily: 'lobster',
                        fontSize: 24,
                        lineHeight: 32
                    }}
                >
                    {selectedStore?.name}
                </MainText>
            </Header>
            <View style={{ marginBottom: 10 }} />
            {mostPopular.length > 0 && (
                <MostPopularView scrollY={currentX}>
                    <MainText style={{ ...FONTS.h4, padding: 10 }}>
                        Most Popular
                    </MainText>

                    <Animated.FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        data={mostPopular}
                        keyExtractor={(item) => item.id!}
                        renderItem={renderMostPopular}
                    />
                </MostPopularView>
            )}

            <Animated.FlatList
                style={{
                    flex: 1,
                    backgroundColor: theme.BACKGROUND_COLOR,
                    marginTop: 10
                }}
                data={categories}
                bounces={false}
                onViewableItemsChanged={viewableItemsChanged}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.name!}
                renderItem={renderCategories}
            />
        </Screen>
    );
};

export default Restaurant;

const MostPopular = styled.View``;

const styles = StyleSheet.create({});
