import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
	return {
		name: 'My Antojito',
		slug: 'Antojito',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'myapp',
		userInterfaceStyle: 'automatic',
		splash: {
			image: './assets/images/splash.png',
			resizeMode: 'cover',
			backgroundColor: '#ffffff',
		},
		updates: {
			fallbackToCacheTimeout: 0,
		},
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: true,

			bundleIdentifier: 'net.robertdev.melendez-ant.dev',
			buildNumber: '1.0.0',
			merchantId: 'merchant.dev.robertdev.melendez-ant.dev',
			infoPlist: {
				NSLocationWhenInUseUsageDescription:
					'We need your location to show you nearby stores / restaurants',
				NSLocationAlwaysUsageDescription:
					'We need your location to show you nearby stores / restaurants',
				NSCameraUsageDescription:
					'We need to access your camara for you to change your profile picture',
				NSPhotoLibraryUsageDescription:
					'We need to access your photos library for you profile picture',
			},
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			versionCode: 1,
			package: 'net.robertdev.IwillFixIt',
			useNextNotificationsApi: true,
		},
		web: {
			favicon: './assets/images/favicon.png',
		},
		extra: {
			apiKey: process.env.apiKey,
			authDomain: process.env.authDomain,
			projectId: process.env.projectId,
			storageBucket: process.env.storageBucket,
			messagingSenderId: process.env.messagingSenderId,
			appId: process.env.appId,
			measurementId: process.env.measurementId,
		},
	};
};
