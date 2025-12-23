import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';

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
const ClassicAccordion = () => {

     const { colors }: {colors : any} = useTheme();
    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections:any) => {
        setActiveSections(
        sections.includes(undefined) ? [] : sections
        );
    };
    

    const AccordionHeader = (item:any, _:any, isActive:any) => {
        return(
            <View style={{
                flexDirection:'row',
                alignItems:'center',
                paddingVertical:10,
            }}>
                <View
                    style={{
                        height:26,
                        width:26,
                        borderRadius:26,
                        backgroundColor:COLORS.primary,
                        marginRight:12,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <Feather size={16} color={COLORS.white} name={isActive ? 'minus' : 'plus'}/>
                </View>
                <Text style={[FONTS.font,FONTS.fontSemiBold,{color:colors.title,flex:1}]}>{item.title}</Text>
            </View>
        )
    }
    const AccordionBody = (item:any, _:any, isActive:any) => {
        return(
            <View style={{marginBottom:15,paddingLeft:38}}>
                <Text style={[FONTS.fontSm,{color:colors.text}]}>{item.content}</Text>
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
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


export default ClassicAccordion;