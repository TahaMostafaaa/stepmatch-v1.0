import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS, IMAGES } from '../../constants/theme'
import { useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';

const Splash = () => {

    const navigation = useNavigation<any>();

    useEffect(() => {
        const timer = setTimeout(() => {
        navigation.replace('OnBoarding'); // 👈 Navigate after 5 seconds
        }, 3000);

        // cleanup timer on unmount
        return () => clearTimeout(timer);
    }, [navigation]);
    
    return (
        <View style={[GlobalStyleSheet.container,{padding:0, flex:1,backgroundColor:COLORS.white}]}>
            <Image
                style={{
                    width:'100%',
                    height:'100%'
                }}
                resizeMode='cover'
                source={IMAGES.Splash}
            />
        </View>
    )
}

export default Splash