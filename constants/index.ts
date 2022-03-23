import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
import Constants from 'expo-constants';

export const COLORS = {
	// colors
	black: '#1E1F20',
	white: '#FFFFFF',
	lightGray: '#ABAFB8',
	light: 'rgba(0, 0, 0, 0.12)',
	gray: '#BEC1D2',
	primary: '#eceff1',
	secondary: '#212121',
	ascent: '#607d8b',
	card: '#F9F8F8',
	background: '#FFFFFF',
	placeHolderTextColor: '#adb5bd70',
	danger: '#E86363',
	tile: '#ecf0f1',

	text: '#555B5D',
};

export const SIZES = {
	// global sizes
	base: 8,
	font: 14,
	radius: 12,
	padding: 24,
	statusBarHeight: Constants.statusBarHeight,

	// font sizes
	navTitle: 25,
	h1: 30,
	h2: 22,
	h3: 16,
	h4: 14,
	h5: 12,
	body1: 30,
	body2: 20,
	body3: 16,
	body4: 14,
	body5: 12,
	isSmallDevice: width < 430,

	// app dimensions
	width,
	height,
	shadow: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '95%',
		height: height * 0.15,
		elevation: 10,
		borderRadius: 5,
		shadowColor: COLORS.ascent,
		shadowOffset: {
			width: 3,
			height: 7,
		},
		padding: 10,
		shadowOpacity: 0.7,
		marginVertical: 8,
		shadowRadius: 10,
		borderColor: COLORS.gray,
		backgroundColor: COLORS.tile,
	},
};

export const WEEKDAYS = {
	1: 'mon',
	2: 'tue',
	3: 'wed',
	4: 'thu',
	5: 'fri',
	6: 'sat',
	7: 'sun',
};

export const STATES = ['New York', 'New Jersey', 'Connecticut', 'Philadelphia'];

export const FONTS = {
	navTitle: { fontFamily: 'monserrat-thin', fontSize: SIZES.navTitle },
	italic: { fontFamily: 'montserrat-bold-italic', fontSize: SIZES.body2 },
	h1: { fontFamily: 'montserrat-bold', fontSize: SIZES.h1, lineHeight: 36 },
	h2: { fontFamily: 'montserrat-bold', fontSize: SIZES.h2, lineHeight: 30 },
	h3: { fontFamily: 'montserrat-bold', fontSize: SIZES.h3, lineHeight: 22 },
	h4: { fontFamily: 'montserrat-bold', fontSize: SIZES.h4, lineHeight: 22 },
	h5: { fontFamily: 'montserrat-bold', fontSize: SIZES.h5, lineHeight: 22 },
	itemTitle: {
		fontFamily: 'montserrat-bold',
		fontSize: 20,
		lineHeight: 26,
		textTransform: 'capitalize',
		color: COLORS.secondary,
	},
	body1: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body1,
		lineHeight: 36,
	},
	body2: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body2,
		lineHeight: 30,
	},
	body3: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body3,
		lineHeight: 22,
	},
	body4: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body4,
		lineHeight: 22,
	},
	body5: {
		fontFamily: 'montserrat',
		fontSize: SIZES.body5,
		lineHeight: 22,
	},
};

const appTheme = { COLORS, SIZES, FONTS, WEEKDAYS, STATES };

export default appTheme;
