import React, { FC, useRef } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	ViewStyle,
} from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import { FONTS, COLORS, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	onPressLeft: () => void;
	onPressRight: () => void;
	rightCondition?: string;
	leftCondition?: string;
	condition?: string;
	height?: number;
	width?: number;
	contentBackgroundColor?: ViewStyle['backgroundColor'];
}

const Toogler: FC<Props> = ({
	onPressLeft,
	onPressRight,
	leftCondition,
	rightCondition,
	contentBackgroundColor,
	condition,
	height,
	width,
}) => {
	const ref = useRef<any>();
	const theme = useAppSelector((state) => state.theme);

	const transition = (
		<Transition.Together>
			<Transition.Change />
		</Transition.Together>
	);

	return (
		<Transitioning.View
			transition={transition}
			ref={ref}
			style={[
				styles.container,
				{
					height: height ? height : 40,
					width: width
						? width
						: SIZES.isSmallDevice
						? SIZES.width * 0.6
						: SIZES.width * 0.4,
				},
			]}
		>
			<View
				style={{
					position: 'absolute',
					backgroundColor: contentBackgroundColor
						? contentBackgroundColor
						: theme.SECONDARY_BUTTON_COLOR,
					bottom: 0,
					top: 0,
					left: leftCondition === condition ? 0 : undefined,
					right: rightCondition === condition ? 0 : undefined,
					width: '50%',
					overflow: 'hidden',
					zIndex: 10,
					justifyContent: 'center',
					alignItems: 'center',

					borderTopRightRadius: rightCondition === condition ? 25 : 0,
					borderBottomRightRadius: rightCondition === condition ? 25 : 0,
					borderTopLeftRadius: leftCondition === condition ? 25 : 0,
					borderBottomLeftRadius: leftCondition === condition ? 25 : 0,
				}}
			>
				<Text
					style={{
						...FONTS.h3,
						textTransform: 'capitalize',
						color: theme.WHITE_COLOR,
					}}
				>
					{condition === 'pickup' ? 'pick up' : condition}
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => {
					ref.current.animateNextTransition();
					onPressLeft();
				}}
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
					width: '50%',
					height: '100%',
					backgroundColor: theme.WHITE_COLOR,
					borderBottomLeftRadius: 25,
					borderTopLeftRadius: 25,
				}}
			>
				<Text
					style={
						leftCondition === condition
							? { ...FONTS.h3, textTransform: 'capitalize' }
							: { ...FONTS.body3, textTransform: 'capitalize' }
					}
				>
					{leftCondition}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => {
					ref.current.animateNextTransition();
					onPressRight();
				}}
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
					width: '50%',
					height: '100%',
					backgroundColor: theme.WHITE_COLOR,
					borderBottomRightRadius: 25,
					borderTopRightRadius: 25,
				}}
			>
				<Text
					style={
						rightCondition === condition
							? { ...FONTS.h3, textTransform: 'capitalize' }
							: { ...FONTS.body3, textTransform: 'capitalize' }
					}
				>
					{rightCondition === 'pickup' ? 'pick up' : rightCondition}
				</Text>
			</TouchableOpacity>
		</Transitioning.View>
	);
};

export default Toogler;

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		flexDirection: 'row',
		marginVertical: 10,
		borderWidth: 0.3,
		borderRadius: 25,
		borderColor: COLORS.lightGray,
	},
});
