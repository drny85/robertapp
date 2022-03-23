import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { MainText } from '.';
import { FONTS, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
    onPress: any;
    address: string;
    onPressClose: () => void;
    ref?: any;
    errorMessage?: React.ReactElement | null;
}

const GoogleAutoComplete: FC<Props> = React.forwardRef(
    ({ onPress, errorMessage, onPressClose, address }, ref) => {
        const theme = useAppSelector((state) => state.theme);
        return (
            <GooglePlacesAutocomplete
                ref={ref as any}
                placeholder="Type your delivery address"
                nearbyPlacesAPI="GooglePlacesSearch"
                keyboardShouldPersistTaps="handled"
                query={{
                    key: process.env.GOOGLE_API,
                    components: 'country:us',
                    language: 'en' // language of the results
                }}
                debounce={400}
                minLength={2}
                enablePoweredByContainer={false}
                onPress={onPress}
                fetchDetails={true}
                currentLocation={true}
                textInputProps={{
                    //InputComp: InputField,
                    placeholderTextColor: theme.TEXT_COLOR,
                    leftIcon: {
                        type: 'font-awesome',
                        name: 'chevron-left'
                    },
                    errorStyle: { color: 'red' }
                }}
                styles={{
                    container: {
                        flex: 0,
                        paddingVertical: 4
                    },
                    textInput: {
                        color: theme.mode === 'dark' ? '#ffffff' : '#212121',
                        backgroundColor: theme.BACKGROUND_COLOR,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 25,
                        marginHorizontal: 10,
                        shadowOffset: {
                            width: 6,
                            height: 6
                        },
                        shadowColor: theme.SHADOW_COLOR,
                        shadowOpacity: 0.4,
                        shadowRadius: 6,
                        elevation: 6,
                        ...FONTS.body3
                    },
                    textInputContainer: {
                        borderRadius: SIZES.radius * 3,
                        backgroundColor:
                            theme.mode === 'light' ? '#ffffff' : '#212121'
                    },
                    description: {
                        color: theme.mode === 'light' ? '#212121' : '#ffffff'
                    },
                    listView: {
                        borderRadius: 10,
                        marginHorizontal: 4
                    },
                    row: {
                        backgroundColor:
                            theme.mode === 'dark' ? '#212121' : '#ffffff'
                    }
                }}
                renderRightButton={() =>
                    address.length > 1 ? (
                        <TouchableOpacity
                            onPress={onPressClose}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: theme.BACKGROUND_COLOR,
                                marginRight: SIZES.padding * 0.5
                            }}
                        >
                            <MaterialIcons
                                name="close"
                                size={24}
                                color={theme.TEXT_COLOR}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Text></Text>
                    )
                }
            />
        );
    }
);

export default GoogleAutoComplete;
