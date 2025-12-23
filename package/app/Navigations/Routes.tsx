import React, {useState} from "react";
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import StackNavigator from "./StackNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import themeContext from '../constants/themeContext';
import { COLORS } from "../constants/theme";

const Routes = () => {

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    
    const authContext = React.useMemo(() => ({
        setDarkTheme: () => {
            setIsDarkTheme(true);
        },
        setLightTheme: () => {
            setIsDarkTheme(false);
        }
    }), []);

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


    return (
        <SafeAreaProvider>
            <themeContext.Provider value={authContext}>
                <NavigationContainer theme={theme}>
					<StackNavigator />
                </NavigationContainer>
            </themeContext.Provider>
        </SafeAreaProvider>
    );
};

export default Routes;