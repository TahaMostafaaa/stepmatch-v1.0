import React from 'react';
import BottomNavigation from './BottomNavigation';
import {  Platform, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';


const DrawerNavigation = (props : any) => {

    const theme = useTheme();
    const {colors} : {colors : any} = theme;

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    return (
        <SafeAreaView
            style={{
                flex:1,
                backgroundColor:colors.card,
                paddingTop:STATUSBAR_HEIGHT
            }}
            edges={['bottom']}
        >
            <BottomNavigation/>
        </SafeAreaView>
    );
};


export default DrawerNavigation;