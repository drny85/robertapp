import {
	NativeSyntheticEvent,
	StyleSheet,
	Text,
	TextInputKeyPressEventData,
	View,
} from 'react-native';
import React, { FC } from 'react';
import InputField from './InputField';
import { SIZES } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useAppSelector } from '../redux/store';

interface Props {
	searchText: string;
	onChangeText: (value: string) => void;
	onPressSearch: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
	onPressClearButton: () => void;
}
const RestaurantSearch: FC<Props> = ({
	searchText,
	onChangeText,
	onPressClearButton,
	onPressSearch,
}) => {
	const theme = useAppSelector((state) => state.theme);
	const { products } = useAppSelector((state) => state.products);
	const { stores } = useAppSelector((state) => state.stores);
	const ids = stores.map((s) => s.id);

	return (
		<View style={{ width: SIZES.width * 0.9 }}>
			<InputField
				placeholder='What would you like to eat today?'
				value={searchText}
				returnKeyType='search'
				returnKeyLabel='Search'
				onKeyPress={onPressSearch}
				onChangeText={onChangeText}
				rightIcon={
					searchText.length > 0 ? (
						<AntDesign
							onPress={onPressClearButton}
							name='closecircleo'
							style={{ marginRight: SIZES.padding * 0.3 }}
							size={24}
							color={theme.TEXT_COLOR}
						/>
					) : undefined
				}
			/>
		</View>
	);
};

export default RestaurantSearch;

const styles = StyleSheet.create({});
