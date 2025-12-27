import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from "./app/Navigations/Routes";

const App = () =>{
	// #region agent log
	useEffect(() => {
		fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:9',message:'App component rendering',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
	}, []);
	// #endregion

	const [loaded] = useFonts({
		NunitoRegular : require('./app/assets/fonts/Nunito-Regular.ttf'),
		NunitoBold : require('./app/assets/fonts/Nunito-Bold.ttf'),
		NunitoSemiBold : require('./app/assets/fonts/Nunito-SemiBold.ttf'),
		NunitoMedium : require('./app/assets/fonts/Nunito-Medium.ttf'),
		NunitoBoldItalic : require('./app/assets/fonts/Nunito-BoldItalic.ttf'),

		OleoScriptBold : require('./app/assets/fonts/OleoScript-Bold.ttf'),
		
	});  

	// #region agent log
	useEffect(() => {
		fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:26',message:'Font loading state changed',data:{loaded},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		if (!loaded) {
			fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:28',message:'Fonts not loaded yet',data:{loaded},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		} else {
			fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:30',message:'Fonts loaded, rendering Routes',data:{loaded},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		}
	}, [loaded]);
	// #endregion

	if(!loaded){
		return null;
	}

	return (
		<SafeAreaProvider>
      		<Routes/>
		</SafeAreaProvider>
	);
};

export default App;
