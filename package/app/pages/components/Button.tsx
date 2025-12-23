import React from 'react';
import { TouchableOpacity, Text, Platform,View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';

type Props = {
    title : string,
    icon ?: any,
    onPress ?: any,
}

const Button = ({title,onPress,icon} : Props) => {
    return (
        <TouchableOpacity
            activeOpacity={.8}
            onPress={() => onPress && onPress()}
        >
            <View
                style={[GlobalStyleSheet.container,{
                    padding:0,
                    shadowColor: COLORS.primary,
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: .5,
                    shadowRadius: 12,
                    borderRadius:15,
                },Platform.OS === 'ios' && {
                    backgroundColor : COLORS.primary,
                    borderRadius:15,
                    padding:0
                }]}
            >
                <LinearGradient
                    colors={[COLORS.primary,COLORS.primary]}
                    style={[{
                        height:56,
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'center',
                        borderRadius:15,
                        padding:6
                    },Platform.OS === 'ios' && {
                        padding:0,
                        paddingHorizontal:6
                    }]}
                >
                    {icon &&
                        <View
                            style={{
                                height:40,
                                width:44,
                                borderRadius:10,
                                backgroundColor:COLORS.white,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                            <Image
                                style={{height:12,width:12}}
                                resizeMode='contain'
                                source={icon}
                            />
                        </View>
                    }
                    <Text style={{
                        ...FONTS.fontSemiBold,
                        fontSize:18,
                        color:COLORS.white,
                        flex:1,
                        textAlign:'center',
                        textTransform:'capitalize',
                    }}>{title}</Text>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );
};

export default Button;