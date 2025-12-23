import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

import { COLORS, FONTS, IMAGES } from '../../constants/theme';

const HeaderStyle2 = (props:any) => {
    
     const { colors }: {colors : any} = useTheme();

    return (
        <>
        <View
            style={[{
                shadowColor: "#000",
                shadowOffset: {
                    width: 2,
                    height: 2,
                },
                shadowOpacity: .1,
                shadowRadius: 5,
            },Platform.OS == 'ios' && {
                backgroundColor:colors.cardBg,
            }]}
        >
            <View style={{
                height:50,
                backgroundColor: colors.cardBg,
                flexDirection:'row',
                alignItems:'center',
                paddingHorizontal:5,
            }}>
                <TouchableOpacity
                    style={{
                        height:50,
                        width:50,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <Feather color={colors.title} name='menu' size={18}/>
                </TouchableOpacity>
                <Text style={{...FONTS.h6,color:colors.title,flex:1,textAlign:'center'}}>{props.title}</Text>
                <TouchableOpacity
                    style={{
                        height:50,
                        width:50,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <View
                        style={{
                            position:'absolute',
                            bottom:8,
                            right:8,
                            zIndex:1,
                            borderWidth:2,
                            borderColor:colors.cardBg,
                            backgroundColor:COLORS.success,
                            height:12,
                            width:12,
                            borderRadius:10,
                        }}
                    />
                    <Image 
                        style={{
                            height:32,
                            width:32,
                            borderRadius:20,
                        }}
                        source={IMAGES.userPic}
                    />
                </TouchableOpacity>
            </View>
        </View>
        </>
    );
};



export default HeaderStyle2;