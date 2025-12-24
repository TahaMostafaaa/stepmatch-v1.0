import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import ToggleStyle1 from '../../components/Toggles/ToggleStyle1';
import themeContext from '../../constants/themeContext';


const ProfileData = [
    {
        id:"0",
        name:"setting",
        image:IMAGES.settings,
        navigate:'Settings'
    },
    {
        id:"1",
        name:"Subscription",
        image:IMAGES.pro,
        navigate:'Subscription'
    },
    {
        id:"2",
        name:"Dark mode",
        image:IMAGES.DarkLight,
    },
    {
        id:"3",
        name:"Privacy policy",
        image:IMAGES.note,
        navigate:'PrivacyPolicy'
    },
    {
        id:"4",
        name:"Terms & Condition",
        image:IMAGES.paper,
        navigate:'TermsandConditions'
    },
    {
        id:"5",
        name:"Contact us",
        image:IMAGES.Contactus,
        navigate:'ContactUs'
    },
    {
        id:"6",
        name:"Safety & Policy",
        image:IMAGES.note,
        navigate:'SafetyPolicy'
    },
    {
        id:"7",
        name:"Help Center",
        image:IMAGES.HelpCenter,
        navigate:'HelpCenter'
    },
    {
        id:"8",
        name:"Account & Security",
        image:IMAGES.Security,
        navigate:'AccountSecurity'
    },
    {
        id:"9",
        name:"Language",
        image:IMAGES.Language,
        navigate:'Language'
    },
    {
        id:"10",
        name:"Faq",
        image:IMAGES.Faq,
        navigate:'Faq'
    },
]

const Profile = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme;

    const {setDarkTheme,setLightTheme} = React.useContext<any>(themeContext);

    const navigation = useNavigation<any>();

    const [progress, setProgress] = useState(0.1); // 0.0 to 1.0 (means 40%)

     // Example: Animate progress to 80%
    useEffect(() => {
        const timer = setTimeout(() => {
        setProgress(0.4); // 80% after delay
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View 
            style={[GlobalStyleSheet.container,{
                padding:0,
                flex:1,
                backgroundColor:colors.card
            }]}
        >
            <Header
                title="Profile"
                rightIcon={'EditProfile'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1,paddingBottom:100}}
            >
                <View
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'space-around',
                        marginBottom:10,
                    }}
                >
                    <View
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                    >
                        <View
                            style={{transform:[{rotate : '180deg'}]}}
                        >
                            <Progress.Circle 
                                borderWidth={0}
                                unfilledColor={'#F5F5F5'}
                                color={COLORS.primary}
                                progress={progress}
                                size={178} 
                                thickness={5}
                                strokeCap={'round'}
                            />
                        </View>
                        <Image
                            style={{
                                height:160,
                                width:160,
                                borderRadius:100,
                                position:'absolute',
                            }}
                            source={IMAGES.likedPic8}
                        />
                        <View
                            style={[styles.profileProgress]}
                        >
                            <Text style={[FONTS.fontBold,{fontSize:12,color:COLORS.white}]}>{Math.round(progress * 100)}% Complete</Text>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.flexaling,{justifyContent:'center',gap:10,marginBottom:15}]}>
                    <Text style={{...FONTS.fontBold,color:colors.title,lineHeight:18,fontSize:18}}>Sofia, 19</Text>
                    <Image 
                        style={{
                            height:22,
                            width:22
                        }}
                        resizeMode='contain'
                        source={IMAGES.Check}
                    />
                </View>
                <View style={{flex:1,paddingHorizontal:25}}>
                    {ProfileData.map((data, index) => {
                        if(data.id === '2'){
                            return(
                                <View
                                    key={index}
                                    style={[GlobalStyleSheet.flexCenter,{paddingVertical:12}]}
                                >
                                    <View
                                        style={[GlobalStyleSheet.flexaling,{flex:1,gap:10}]}
                                    >
                                        <Image
                                            style={[GlobalStyleSheet.image,{tintColor:colors.title}]}
                                            source={data.image}
                                            resizeMode='contain'
                                        />
                                        <Text style={[FONTS.fontBold,{fontSize:14,color:colors.title,lineHeight:14,textTransform:'capitalize',flex:1}]}>{data.name}</Text>
                                    </View>
                                    <ToggleStyle1
                                        active={theme.dark}
                                        onToggle={(value : any) => {
                                            if(value){
                                                setDarkTheme();
                                            }else{
                                                setLightTheme();
                                            }
                                        }}
                                    />
                                </View>
                            )
                        }else{
                            return(
                                <TouchableOpacity
                                    onPress={() => navigation.navigate(data.navigate)}
                                    activeOpacity={0.8}
                                    key={index}
                                    style={[GlobalStyleSheet.flexCenter,{paddingVertical:12}]}
                                >
                                    <View
                                        style={[GlobalStyleSheet.flexaling,{flex:1,gap:10}]}
                                    >
                                        <Image
                                            style={[GlobalStyleSheet.image,{tintColor:data.id === '1' ? '#FFB743': colors.title}]}
                                            source={data.image}
                                            resizeMode='contain'
                                        />
                                        <Text style={[FONTS.fontBold,{fontSize:14,color:colors.title,lineHeight:14,textTransform:'capitalize',flex:1}]}>{data.name}</Text>
                                    </View>
                                    <Feather name='chevron-right' size={20} color={colors.title}/>
                                </TouchableOpacity>
                            )
                        }
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    headerArea : {
        flexDirection:'row',
        paddingTop:15,
        paddingBottom:20,
        alignItems:'center',
        justifyContent:'space-between',
    },
    actionBtn : {
        height:50,
        width:50,
        borderRadius:50,
        backgroundColor:COLORS.primayLight,
        alignItems:'center',
        justifyContent:'center',
    },
    profileArea : {
        paddingBottom:40,
        paddingHorizontal:15,
    },
    profileProgress : {
        position:'absolute',
        bottom:0,
        backgroundColor:COLORS.primary,
        paddingHorizontal:12,
        paddingVertical:7,
        borderRadius:20,
    },
    priceListItem:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:8,
    }
})


export default Profile