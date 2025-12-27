import React, {useState, useEffect} from "react";
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import themeContext from '../constants/themeContext';
import { MatchingProvider } from '../context/matchingContext';
import { AuthProvider } from '../auth/auth.context';
import AuthGuard from './AuthGuard';
import { COLORS } from "../constants/theme";

const Routes = () => {
	// #region agent log
	useEffect(() => {
		fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Routes.tsx:14',message:'Routes component rendering',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
	}, []);
	// #endregion

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    
    const authContext = React.useMemo(() => ({
        isDarkTheme,
        setDarkTheme: () => {
            setIsDarkTheme(true);
        },
        setLightTheme: () => {
            setIsDarkTheme(false);
        }
    }), [isDarkTheme]);

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            text : COLORS.text,
            textLight : '#a19fa8',
            title : COLORS.title,
            background : 'rgba(25,25,25,0.04)',
            input:"#EDEDED",
            bgLight : '#F0F0F0',
            card : COLORS.white,
            cardBg : COLORS.white,
            borderColor : COLORS.borderColor,
            themeBg : "#F4F6FF",
            bgGradient : ['#FFFBF6', '#FBE7DF'],
        }
    }
    
    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            text : 'rgba(255, 255, 255, 0.7)',
            textLight : 'rgba(255, 255, 255, 0.7)',
            title : '#fff',
            background : '#303437',
            input:"#303437",
            bgLight : 'rgba(255,255,255,.1)',
            card : '#0C1216',
            cardBg : "#0c1746",
            borderColor : COLORS.darkBorder,
            themeBg : "#00092D",
            bgGradient : ['#2c3f6d', '#2c3f6d'],
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

	// #region agent log
	useEffect(() => {
		fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Routes.tsx:66',message:'Routes about to render providers',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
	}, []);
	// #endregion

    return (
        <SafeAreaProvider>
            <themeContext.Provider value={authContext}>
                <AuthProvider>
                    <MatchingProvider>
                        <NavigationContainer theme={theme}>
                            <AuthGuard />
                        </NavigationContainer>
                    </MatchingProvider>
                </AuthProvider>
            </themeContext.Provider>
        </SafeAreaProvider>
    );
};

export default Routes;