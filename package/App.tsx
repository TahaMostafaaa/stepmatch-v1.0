import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Routes from "./app/Navigations/Routes";
import { COLORS, FONTS } from './app/constants/theme';

const App = () =>{
	// #region agent log
	useEffect(() => {
		fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:9',message:'App component rendering',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
	}, []);
	// #endregion

	const [loaded, error] = useFonts({
		NunitoRegular : require('./app/assets/fonts/Nunito-Regular.ttf'),
		NunitoBold : require('./app/assets/fonts/Nunito-Bold.ttf'),
		NunitoSemiBold : require('./app/assets/fonts/Nunito-SemiBold.ttf'),
		NunitoMedium : require('./app/assets/fonts/Nunito-Medium.ttf'),
		NunitoBoldItalic : require('./app/assets/fonts/Nunito-BoldItalic.ttf'),

		OleoScriptBold : require('./app/assets/fonts/OleoScript-Bold.ttf'),
		
	});

	const [fontLoadTimeout, setFontLoadTimeout] = useState(false);

	// Set timeout for font loading (10 seconds)
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!loaded) {
				console.warn('[App] Font loading timeout - proceeding without fonts');
				setFontLoadTimeout(true);
			}
		}, 10000);

		return () => clearTimeout(timeout);
	}, [loaded]);

	// #region agent log
	useEffect(() => {
		fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:26',message:'Font loading state changed',data:{loaded,error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		if (!loaded) {
			fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:28',message:'Fonts not loaded yet',data:{loaded},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		} else {
			fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:30',message:'Fonts loaded, rendering Routes',data:{loaded},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		}
	}, [loaded, error]);
	// #endregion

	// Show loading screen while fonts are loading (but with timeout fallback)
	if (!loaded && !fontLoadTimeout) {
		return (
			<SafeAreaProvider>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.primary} />
					<Text style={styles.loadingText}>Loading...</Text>
				</View>
			</SafeAreaProvider>
		);
	}

	// If fonts failed to load or timed out, still render the app (fonts will use system defaults)
	if (error) {
		console.error('[App] Font loading error:', error);
	}

	return (
		<SafeAreaProvider>
      		<Routes/>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.white,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: COLORS.text,
	},
});

export default App;
