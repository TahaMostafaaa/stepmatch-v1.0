import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';

const SECTIONS = [
    {
        icon : IMAGES.cards,
        title: 'How do I start dating?',
        content: "Starting to date usually begins with meeting people through mutual friends, online dating apps, social events, or other activities. It's essential to be open to new experiences and be yourself.",
    },
    {
        icon : IMAGES.rejected,
        title: 'How can I deal with rejection?',
        content: "Rejection is a part of dating. It's important to remember that it's not a reflection of your worth as a person. Keep a positive mindset, learn from the experience, and continue putting yourself out there.",
    },
    {
        icon : IMAGES.shield,
        title: 'Is online dating safe?',
        content: "Online dating can be safe, but it's essential to take precautions. Meet in public places for initial meetings, share information sparingly, and trust your instincts. Research the platform you're using and consider background checks if necessary.",
    },
];

const AccordionSeprator = (props:any) => {

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
                paddingVertical:15,
            }}>
                <Image
                    source={item.icon}
                    style={{
                        height:20,
                        width:20,
                        resizeMode:'contain',
                        tintColor:COLORS.primary,
                        marginRight:12,
                    }}
                />
                {/* <FontAwesome style={{marginRight:10}} name={item.icon} size={15} color={item.color}/> */}
                <Text style={[FONTS.font,FONTS.fontSemiBold,{color:colors.title,flex:1}]}>{item.title}</Text>
                <FontAwesome name={isActive ? 'angle-up' : 'angle-down'} size={20} color={colors.title}/>
            </View>
        )
    }
    const AccordionBody = (item:any, _:any, isActive:any) => {
        return(
            <View style={{marginBottom:15}}>
                <Text style={[FONTS.fontSm,{color:colors.text}]}>{item.content}</Text>
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                sectionContainerStyle={{
                    borderBottomWidth:1,
                    borderColor:colors.borderColor,
                }}
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


export default AccordionSeprator;