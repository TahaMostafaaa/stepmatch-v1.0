import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from "./app/Navigations/Routes";

const App = () =>{

	const [loaded] = useFonts({
		NunitoRegular : require('./app/assets/fonts/Nunito-Regular.ttf'),
		NunitoBold : require('./app/assets/fonts/Nunito-Bold.ttf'),
		NunitoSemiBold : require('./app/assets/fonts/Nunito-SemiBold.ttf'),
		NunitoMedium : require('./app/assets/fonts/Nunito-Medium.ttf'),
		NunitoBoldItalic : require('./app/assets/fonts/Nunito-BoldItalic.ttf'),

		OleoScriptBold : require('./app/assets/fonts/OleoScript-Bold.ttf'),
		
	});  

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
