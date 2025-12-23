import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, Platform, StatusBar, } from 'react-native'
import { COLORS ,FONTS, IMAGES,} from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useNavigation, useTheme } from '@react-navigation/native'
import Button from '../../components/Button/Button'
import { Feather } from '@expo/vector-icons';
import Header from '../../layout/Header'

const selectData = [
  {
    iconText:"E",
    iconColor:"#D1E5DC",
    title:"English",
    LanguageText:"English",
  },
  {
    iconText:"हिं",
    iconColor:"#F2DBBC",
    title:"हिंदी",
    LanguageText:"Hindi",
  },
  {
    iconText:"த",
    iconColor:"#E5D1D9",
    title:"தமிழ்",
    LanguageText:"Tamil",
  },
  {
    iconText:"म",
    iconColor:"#E5D1D1",
    title:"मराठी",
    LanguageText:"Marathi",
  },
  {
    iconText:"తె",
    iconColor:"#D1DBE5",
    title:"తెలుగు",
    LanguageText:"Telugu",
  },
  {
    iconText:"മ",
    iconColor:"#DED1E5",
    title:"മലയാളം",
    LanguageText:"Malayalam",
  },
  {
    iconText:"ಕ",
    iconColor:"#EEE8C5",
    title:"ಕನ್ನಡ",
    LanguageText:"Kannada",
  },
  {
    iconText:"Ar",
    iconColor:"#D1E5DC",
    title:"Arabic",
    LanguageText:"Arabic",
  },
  {
    iconText:"In",
    iconColor:"#FBCCD4",
    title:"Indonesian",
    LanguageText:"Indonesian",
  }
]


const language = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
      
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const [Select, setSelect] = useState(selectData[0]);

    const navigation = useNavigation();

    return (
        <View 
            style={[GlobalStyleSheet.container,{
                paddingTop:STATUSBAR_HEIGHT,
                padding:0,
                flex:1,
                backgroundColor:colors.card
            }]}
        >
            <Header
                title="Select Language"
                leftIcon={'back'}
            />
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:20}]}>
                    <View style={[GlobalStyleSheet.row]}>
                        {selectData.map((data:any,index:any) => {
                            return(
                            <View style={{marginBottom:6}} key={index}>
                                <TouchableOpacity
                                    onPress={() => setSelect(data)}
                                    activeOpacity={0.6} 
                                    style={[{
                                        height:60,
                                        width:'100%',
                                        backgroundColor:colors.background,
                                        borderRadius:8,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'space-between',
                                        paddingHorizontal:10
                                    }]}
                                >
                                    <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                                        <View
                                            style={{
                                                height:40,
                                                width:40,
                                                borderRadius:50,
                                                backgroundColor:data.iconColor,
                                                alignItems:'center',
                                                justifyContent:'center'
                                            }}
                                        > 
                                            <Text style={[FONTS.fontLg,{...FONTS.fontMedium,color:COLORS.title}]}>{data.iconText}</Text>
                                        </View>
                                        <Text style={[FONTS.fontLg,{color:colors.title}]}>{data.title}</Text>
                                    </View>
                                    <View style={[GlobalStyleSheet.row,{gap:12,paddingRight:7}]}>
                                        <Text style={[FONTS.font,{color:colors.text}]}>{data.LanguageText}</Text>
                                        <View 
                                            style={{
                                                height:24,
                                                width:24,
                                                borderWidth:1,
                                                backgroundColor:Select === data ? COLORS.primary : colors.card,
                                                borderColor:Select === data ? COLORS.primary : colors.borderColor,
                                                borderRadius:25,
                                                alignItems:'center',
                                                justifyContent:'center'
                                            }}
                                        >
                                            <Feather size={14} color={Select === data ? COLORS.white :theme.dark ? COLORS.title:COLORS.white} name={'check'} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
            <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                <Button
                    title={'Save'}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}

export default language;