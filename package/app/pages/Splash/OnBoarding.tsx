import React, { useRef } from 'react';
import { 
    View,
    ScrollView,
    StyleSheet,
    StatusBar,
    ImageBackground,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Button from '../components/Button';


type OnBoardingScreenProps = NativeStackScreenProps<RootStackParamList, 'OnBoarding'>;

const OnBoarding = ({ navigation } : OnBoardingScreenProps) => {

    const { colors }: {colors : any} = useTheme();

    return (
        <View
            style={[GlobalStyleSheet.container,{
                padding:0,
                flex:1,
                backgroundColor:colors.card,
            }]}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content" // white icons on dark background
            />

            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <ImageBackground
                    style={{
                        width:'100%',
                        height:'100%'
                    }}
                    resizeMode='cover'
                    source={IMAGES.bgpic1} 
                >
                    <LinearGradient
                        colors={['#000000', 'rgba(0,0,0,.48)','#000000']}
                        style={{
                            height:'100%',
                            width:'100%',
                            position:'absolute',
                            left:0,
                            right:0,
                            top:0,
                            bottom:0
                        }}
                    />
                    <View style={{flex:1}}>
                        <View style={{alignItems:'center',marginTop:80}}>
                            <Text style={[FONTS.fontBold,{fontSize:25,color:COLORS.primary}]}>Ditto</Text>
                        </View>
                        <View style={[GlobalStyleSheet.container,{flex:1,justifyContent:'flex-end',paddingBottom:70,paddingHorizontal:32,paddingRight:70}]}>
                            <View style={{marginBottom:30}}>
                                <Text style={[FONTS.OleoScriptBold,{fontSize:48,color:colors.card,lineHeight:63}]}>Discover{'\n'}Your Match</Text>
                            </View>
                            <View style={[styles.flex,{gap:11}]}>
                                <View style={{flex:1}}>
                                    <Button
                                        onPress={() => navigation.navigate('Login')}
                                        title={'Get Started'}
                                        icon={IMAGES.uparrow}
                                    />
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.background,{backgroundColor:'rgba(255,255,255,0.30)'}]}
                                >
                                    <Image
                                        style={{height:21,width:21}}
                                        resizeMode='contain'
                                        source={IMAGES.Apple}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.background,{backgroundColor:'rgba(255,255,255,0.30)'}]}
                                >
                                    <Image
                                        style={{height:21,width:21}}
                                        resizeMode='contain'
                                        source={IMAGES.google}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    flex:{
        flexDirection:'row',
        alignItems:'center'
    },
    background: {
        height:51,
        width:51,
        borderRadius:15,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(255,255,255,0.30)'
    }
})

export default OnBoarding;
