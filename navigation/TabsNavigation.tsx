import {
    CartStackScreenParams,
    RestaurantsStackParamList,
    RootStackScreenProps,
    RootTabParamList
} from '../types';
import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../redux/store';

import RestaurantsStack from './restaurants/RestaurantsStack';
import {
    getFocusedRouteNameFromRoute,
    RouteProp
} from '@react-navigation/native';
import OrdersStack from './orders/OrdersStack';
import CartStack from './cart/CartStack';
import AuthStack from './auth/AuthStack';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color?: string;
}) {
    const theme = useAppSelector((state) => state.theme);
    return (
        <Ionicons
            size={30}
            style={{ marginBottom: -2 }}
            {...props}
            color={theme.TEXT_COLOR}
        />
    );
}

const { Navigator, Screen } = createBottomTabNavigator<RootTabParamList>();

const TabsNavigation: FC = () => {
    const theme = useAppSelector((state) => state.theme);
    const { itemsCount } = useAppSelector((state) => state.cart);

    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.BACKGROUND_COLOR,
                    borderTopWidth: 0,
                    elevation: 0,
                    borderColor: theme.BACKGROUND_COLOR
                },

                tabBarActiveTintColor: theme.SECONDARY_BUTTON_COLOR,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: theme.SHADOW_COLOR
            }}
        >
            <Screen
                name="RestaurantsStack"
                component={RestaurantsStack}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },
                    tabBarIcon: () => <TabBarIcon name="restaurant-outline" />
                })}
            />
            <Screen
                name="OrdersStack"
                component={OrdersStack}
                options={{
                    title: 'Orders',
                    tabBarIcon: () => <TabBarIcon name="md-list" />
                }}
            />
            <Screen
                name="CartStack"
                component={CartStack}
                options={({ route }) => ({
                    tabBarBadge: itemsCount,
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="cart-outline" />
                })}
            />
            <Screen
                name="ProfileStack"
                component={AuthStack}
                options={{
                    tabBarIcon: () => <TabBarIcon name="person" />
                }}
            />
        </Navigator>
    );
};

const tabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (
        routeName === 'Restaurant' ||
        routeName === 'ProductDetails' ||
        routeName === 'Checkout'
    ) {
        return 'none';
    }
    return 'flex';
};

export default TabsNavigation;
