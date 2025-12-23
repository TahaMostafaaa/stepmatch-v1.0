import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const SECTIONS = [
    {
        title: 'How do I start dating?',
        content: "Starting to date usually begins with meeting people through mutual friends, online dating apps, social events, or other activities. It's essential to be open to new experiences and be yourself.",
    },
    {
        title: 'How can I deal with rejection?',
        content: "Rejection is a part of dating. It's important to remember that it's not a reflection of your worth as a person. Keep a positive mindset, learn from the experience, and continue putting yourself out there.",
    },
    {
        title: 'Is online dating safe?',
        content: "Online dating can be safe, but it's essential to take precautions. Meet in public places for initial meetings, share information sparingly, and trust your instincts. Research the platform you're using and consider background checks if necessary.",
    },
];

const AccordionHighlight = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = useTheme();

    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections : any) => {
        setActiveSections(
        sections.includes(undefined) ? [] : sections
        );
    };
    

    const AccordionHeader = (item:any, index:any, isActive:any) => {
        return(
            <View style={{
                flexDirection:'row',
                alignItems:'center',
                paddingVertical:12,
                paddingHorizontal:15,
                borderRadius:SIZES.radius,
                backgroundColor: isActive ? COLORS.primary : COLORS.primayLight,
            }}>
                <View
                    style={{
                        height:28,
                        width:28,
                        borderRadius:28,
                        backgroundColor:isActive ? 'rgba(255,255,255,1)' : theme.dark ? 'rgba(255,255,255,.1)' : COLORS.white,
                        marginLeft:-5,
                        marginRight:10,
                        marginVertical:-2,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <Text style={[FONTS.font,FONTS.fontSemiBold,{color:isActive ? COLORS.primary : colors.title,lineHeight:18}]}>{index+1}</Text>
                </View>
                <Text style={[FONTS.font,FONTS.fontSemiBold,{color:isActive ? COLORS.white : colors.title,flex:1,top:-1}]}>{item.title}</Text>
                <FontAwesome name={isActive ? 'angle-up' : 'angle-down'} size={20} color={isActive ? COLORS.white : colors.title}/>
            </View>
        )
    }
    const AccordionBody = (item:any, _:any, isActive:any) => {
        return(
            <View style={{marginBottom:15,marginTop:10,paddingHorizontal:15}}>
                <Text style={[FONTS.fontSm,{color:colors.text}]}>{item.content}</Text>
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                sectionContainerStyle={{marginBottom:8}}
                duration={300}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
};


export default AccordionHighlight;