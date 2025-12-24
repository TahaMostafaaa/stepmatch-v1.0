import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { COLORS, FONTS, } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { GlobalStyleSheet } from '../../constants/StyleSheet';


const FaqAccordion = () => {

    const theme = useTheme();
    const { colors } : {colors : any } = theme;

    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections : any) => {
        setActiveSections(
            sections.includes(undefined) ? [] : sections
        );
    };

    const DATA = [
        {
            title: 'What StepMatch picture should I use?',
            content: "Upload photos to GoMeet$^{\circledR}$ that feature who everyone came to see: you! Ditch your friends because this isn't about them and remove the sunglasses because they hide your face. The best pics are in focus and some say a smile goes a long way here",
        },
        {
            title: 'What should I put in my bio?',
            content: 'Keep it short and authentic! Mention a few hobbies or interests that show your personality. A good bio helps people start a real conversation, so keep it light, friendly, and fun.',
        },
        {
            title: 'Are StepMatch profiles real?',
            content: 'Yes! StepMatch uses advanced verification systems to ensure profiles are genuine. However, always stay cautious and report any suspicious behavior to help keep the community safe.',
        },
        {
            title: 'How do StepMatch matches work?',
            content: "When two people like each other's profiles, it's a match! Once matched, you can start chatting and getting to know each other directly within the app.",
        },
        {
            title: 'How do I unmatch someone?',
            content: "Go to your chat with that person, tap the options menu, and select 'Unmatch'. This will remove the match and end your chat with them.",
        },
        {
            title: "Can I undo a 'Like' or 'Pass'?",
            content: 'Yes, StepMatch Plus users can use the Rewind feature to undo their last action. If you accidentally passed on someone, you can go back and like them again.',
        },
        {
            title: "Can StepMatch be used on a laptop?",
            content: 'Currently, StepMatch is designed for mobile use on iOS and Android devices. A web version may be available in the future!',
        },
        {
            title: "How do I cancel my subscription?",
            content: 'You can cancel anytime from your app store’s subscription settings. Your subscription will remain active until the end of the current billing cycle.',
        },
        {
            title: "How does StepMatch use my location?",
            content: 'StepMatch uses your location to show you potential matches nearby and improve your experience. You can control location permissions anytime in your device settings.',
        },
    ];

    const AccordionHeader = (item: any, _:any, isActive:any) => {

        return (
            <View 
                style={[GlobalStyleSheet.flexCenter,{
                    // padding:14,
                    // backgroundColor:colors.background,
                    // borderRadius:8,
                    // borderWidth:1.5,
                    // borderColor:'#E8E8E8',
                }]}
            >
                <Text 
                    style={[
                        FONTS.fontSemiBold, { 
                            fontSize: 16, 
                            color:theme.dark ? colors.title : '#191919', 
                            paddingRight:15 
                        }
                    ]}
                >{item.title}</Text>
                <Feather 
                    name={"chevron-down"} 
                    size={18} 
                    color={colors.title}
                    style={{transform: [{ rotate:isActive ? '180deg': '0deg' }]}} 
                />
            </View>
        )
    }

    const AccordionBody = (item: any, _:any, isActive:any) => {
        return (
            <View style={{
                marginTop:10
            }}>

                <Text style={[FONTS.fontNunitoRegular, {fontSize:14, color: colors.text, lineHeight: 20 }]}>{item.content}</Text>
            </View>
        )
    }
    
    return (
        <>
            <Accordion
                sections={DATA}
                duration={300}
                sectionContainerStyle={{
                    marginBottom: 13,
                    marginTop:13
                }}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
}

export default FaqAccordion