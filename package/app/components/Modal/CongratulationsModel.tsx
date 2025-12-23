import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import Button from '../Button/Button';
import { GlobalStyleSheet } from '../../constants/StyleSheet';

const CongratulationsModel = () => {

     const { colors }: {colors : any} = useTheme();

    return (
        <>
            <View style={{
                alignItems:'center',
                paddingHorizontal:20,
                paddingVertical:20,
                backgroundColor:colors.card,
                borderRadius:15,
                marginHorizontal:30,
                maxWidth:300,
                overflow:'hidden',
                position:'relative',
            }}>
                <Image
                    style={{
                        width:350,
                        height:206,
                        position:'absolute',
                        top:-100,
                    }}
                    resizeMode='contain'
                    source={IMAGES.ModelShape}
                />
                <Image
                    style={{
                        height:64,
                        width:64,
                        position:'absolute',
                        left:20,
                        top:60
                    }}
                    resizeMode='contain'
                    source={IMAGES.confetti}
                />
                <Image
                    style={{
                        height:64,
                        width:64,
                        position:'absolute',
                        right:20,
                        top:60
                    }}
                    resizeMode='contain'
                    source={IMAGES.confetti1}
                />
                <Image
                    style={{
                        height:50,
                        width:50,
                        position:'absolute',
                        left:30,
                        top:5
                    }}
                    resizeMode='contain'
                    source={IMAGES.Shape1}
                />
                <Image
                    style={{
                        height:50,
                        width:50,
                        position:'absolute',
                        right:30,
                        top:5
                    }}
                    resizeMode='contain'
                    source={IMAGES.Shape1}
                />
                <View style={{paddingVertical:10,position:'relative'}}>
                    <Image
                        style={{height:108,width:108,borderRadius:100}}
                        source={IMAGES.userPic9}
                        resizeMode='cover'
                    />
                    <View
                        style={[GlobalStyleSheet.headerBtn,{
                            height:32,
                            width:32,
                            borderRadius:50,
                            backgroundColor:'#F6708D',
                            position:'absolute',
                            bottom:6,
                            right:6
                        }]}
                    >
                        <Image
                            style={[GlobalStyleSheet.image,{tintColor:COLORS.white}]}
                            source={IMAGES.pro}
                        />
                    </View>
                </View>
                <View style={{marginBottom:35}}>
                    <Text style={{...FONTS.OleoScriptBold,fontSize:30,color:'#EF0A75'}}>Congratulations</Text>
                    <Text style={{...FONTS.fontSemiBold,fontSize:14,color:colors.text,textAlign:'center'}}>Your purchase Successfully</Text>
                </View>
                <View style={{width:252}}>
                    <Button
                        title={'ok'}
                    />
                </View>
            </View>
        </>
    );
};


export default CongratulationsModel;