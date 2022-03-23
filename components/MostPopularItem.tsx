import { LinearGradient } from 'expo-linear-gradient';
import React, { FC } from 'react';
import { ImageBackground, View } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MainText } from '.';
import { FONTS, SIZES, COLORS } from '../constants';
import { Product } from '../redux/productsReducer/productsSlide';
import { useAppSelector } from '../redux/store';

interface Props {
    onPress: () => void;
    item: Product;
}

const MostPouplarItem: FC<Props> = ({ onPress, item }) => {
    const { mostPopular } = useAppSelector((state) => state.products);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    width: SIZES.width / mostPopular.length,
                    minWidth: 100,
                    maxWidth: 300
                }
            ]}
        >
            <ImageBackground style={styles.img} source={{ uri: item.imageUrl }}>
                <View
                    style={{
                        padding: 5,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#6360607d'
                    }}
                >
                    <MainText
                        style={{
                            textTransform: 'capitalize',
                            fontFamily: 'lobster',
                            fontWeight: '400',
                            color: COLORS.white
                        }}
                    >
                        {item.name}
                    </MainText>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default MostPouplarItem;

const styles = StyleSheet.create({
    container: {
        height: SIZES.isSmallDevice ? 60 : 80,
        borderRadius: 10,
        elevation: 5,
        shadowColor: COLORS.lightGray,
        shadowRadius: 4,
        overflow: 'hidden',

        shadowOpacity: 0.7,
        shadowOffset: {
            width: 5,
            height: 8
        },
        marginHorizontal: SIZES.padding * 0.3
    },
    img: {
        height: '100%',
        width: '100%',
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',

        opacity: 0.7
    }
});
