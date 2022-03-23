import {
    Animated,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import React, { FC } from 'react';
import { MainText } from '.';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import { Store } from '../redux/storesReducer/storesSlide';
import { LinearGradient } from 'expo-linear-gradient';
import Row from './Row';

interface Props {
    onPress: () => void;
    restaurant: Store;
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    scale?: any;
    opacity?: any;
}

const RestaurantCard: FC<Props> = ({
    onPress,
    restaurant,
    containerStyle,
    style,
    scale,
    opacity
}): JSX.Element => {
    const theme = useAppSelector((state) => state.theme);
    const { stores } = useAppSelector((state) => state.stores);
    return (
        <Animated.View
            style={[
                containerStyle,
                {
                    transform: scale && [{ scale }],
                    opacity: opacity && opacity,
                    width: SIZES.isSmallDevice
                        ? SIZES.width * 0.9
                        : stores.length > 1
                        ? SIZES.width * 0.45
                        : SIZES.width * 0.9
                }
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.view,
                    { backgroundColor: theme.PRIMARY_BUTTON_COLOR },
                    style
                ]}
                onPress={onPress}
            >
                <ImageBackground
                    style={styles.img}
                    source={{
                        uri: restaurant.imageUrl
                            ? restaurant.imageUrl
                            : 'https://mk0tarestaurant7omoy.kinstacdn.com/wp-content/uploads/2018/01/premiumforrestaurants_0.jpg'
                    }}
                >
                    <LinearGradient
                        colors={['transparent', '#8a8585ab', '#201e1e']}
                        start={{ x: 0.1, y: 0.2 }}
                        end={{ x: 0.0, y: 0.9 }}
                        style={styles.card}
                    >
                        <MainText
                            lightText
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            uppercase
                            bold
                        >
                            {restaurant.name}
                        </MainText>
                        <MainText lightText small>
                            {restaurant.phone}
                        </MainText>
                        {restaurant.deliveryType !== 'pickup' &&
                            restaurant.open && (
                                <Row horizontalAlign="space-between">
                                    <MainText small lightText>
                                        ${restaurant.deliveryMinimum} minimum
                                        delivery
                                    </MainText>
                                    <MainText small bold>
                                        {restaurant.estimatedDeliveryTime} mins
                                    </MainText>
                                </Row>
                            )}
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default RestaurantCard;

const styles = StyleSheet.create({
    view: {
        height: SIZES.height * 0.2,
        marginHorizontal: SIZES.isSmallDevice ? 0 : 10,
        borderRadius: 15,
        elevation: 10,
        shadowColor: 'red',
        shadowOffset: { width: 3, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 15,
        marginVertical: 8,
        overflow: 'hidden'
    },
    img: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 15
    },
    card: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: 8,
        width: '100%',
        backgroundColor: '#646262a6'
    }
});
