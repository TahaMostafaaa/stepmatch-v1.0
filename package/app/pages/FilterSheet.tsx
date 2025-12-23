import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';

const FilterSheet = forwardRef((props:any, ref:any) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme;

    const [ageValue, setAgeValue] = useState([18, 40]);
    
    const [distanceVal, setDistanceVal] = useState<any>([0]);
    
    
    const filterSheetRef = useRef<any>(null);
    
    useImperativeHandle(ref, () => ({
        openSheet: () => {
            filterSheetRef.current?.open();
        },
        closeSheet: () => {
            filterSheetRef.current?.close();
        },
    }));
    
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            // If already selected → remove it
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            // If not selected → add it
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const SearchPreferneceoptions = ['man', 'woman', 'both'];

    const InterestsOption = [
        {
            option:'Travel',
            image:IMAGES.travel
        },
        {
            option:'Yoga',
            image:IMAGES.yoga
        },
        {
            option:'Gaming',
            image:IMAGES.game
        },
        {
            option:'Movie',
            image:IMAGES.movie
        },
        {
            option:'Book',
            image:IMAGES.book
        },
        {
            option:'Birds',
            image:IMAGES.birds
        },
        {
            option:'Cooking',
            image:IMAGES.cook
        },
        {
            option:'Hiking',
            image:IMAGES.Hiking
        },
        {
            option:'Wine',
            image:IMAGES.wine
        },
    ]

    const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);

    const toggleInterest = (option: string) => {
        if (selectedInterests.includes(option)) {
            // Deselect if already selected
            setSelectedInterests(selectedInterests.filter(item => item !== option));
        } else {
            // Add if not selected
            setSelectedInterests([...selectedInterests, option]);
        }
    };


    const LanguagesData = [
        {
            name:"English",
            flag:IMAGES.english
        },
        {
            name:"Hindi",
            flag:IMAGES.hindi
        },
        {
            name:"German",
            flag:IMAGES.German
        },
        {
            name:"Japanese",
            flag:IMAGES.japanese
        },
        {
            name:"Korean",
            flag:IMAGES.korean
        },
        {
            name:"Italian",
            flag:IMAGES.italian
        },
        {
            name:"Russian",
            flag:IMAGES.russian
        },
        {
            name:"Arabic",
            flag:IMAGES.arabic
        },
    ]

    const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);

    const toggleLanguage = (name: string) => {
        if (selectedLanguages.includes(name)) {
            // Deselect if already selected
            setSelectedLanguages(selectedLanguages.filter(item => item !== name));
        } else {
            // Select if not already in the list
            setSelectedLanguages([...selectedLanguages, name]);
        }
    };



    const ReligionData = [
        'Islam',
        'Hindu',
        'Christianity',
        'Buddhism',
        'Judaism',
        'Taoism',
        'Wicca',
        'Zoroastrianism',
        'Jainism',
        'Shintoism',
    ];

    const [selectedReligions, setSelectedReligions] = React.useState<string[]>([]);

    const toggleReligion = (option: string) => {
        if (selectedReligions.includes(option)) {
            // Deselect if already selected
            setSelectedReligions(selectedReligions.filter(item => item !== option));
        } else {
            // Select if not already selected
            setSelectedReligions([...selectedReligions, option]);
        }
    };


    const RelationshipData = [
        {
            name:"Dating",
            image:IMAGES.dating
        },
        {
            name:"Friendship",
            image:IMAGES.friend
        },
        {
            name:"Casual",
            image:IMAGES.Casual
        },
        {
            name:"Serious Relationship",
            image:IMAGES.relationship
        },
        {
            name:"Open to Options",
            image:IMAGES.Options
        },
        {
            name:"Networking",
            image:IMAGES.networking
        },
        {
            name:"Exploration",
            image:IMAGES.exploration
        },
    ]

    const [selectedRelationships, setSelectedRelationships] = React.useState<string[]>([]);

    const toggleRelationship = (name: string) => {
        if (selectedRelationships.includes(name)) {
            // If already selected → remove it
            setSelectedRelationships(selectedRelationships.filter(item => item !== name));
        } else {
            // If not selected → add it
            setSelectedRelationships([...selectedRelationships, name]);
        }
    };



    return (

        <RBSheet
            ref={filterSheetRef}
            height={800}
            closeOnDragDown={true}
            customStyles={{
                container:{
                    backgroundColor:theme.dark ? colors.background : colors.card,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    paddingTop:15,
                    paddingBottom:20
                },
                draggableIcon: {
                    marginTop:5,
                    marginBottom:0,
                    height:5,
                    width:90,
                    backgroundColor: colors.borderColor,
                }
            }}
            customModalProps={{
                animationType: 'slide',
                statusBarTranslucent: true,
            }}
        >
            <View style={[GlobalStyleSheet.container,{
                padding:0,
                paddingTop:20
            }]}>
                <Text style={{...FONTS.fontBold,fontSize:24,color:colors.title,textAlign:'center'}}>Filter & Show</Text>
                <TouchableOpacity
                    onPress={() => filterSheetRef.current.close()}
                    style={{
                        padding:10,
                        position:'absolute',
                        left:5,
                        top:-10,
                        borderRadius:50
                    }}
                >
                    <Feather size={24} color={colors.title} name='x'/>
                </TouchableOpacity>
                <View style={{paddingHorizontal:25,paddingVertical:20}}>
                    <Text style={{...FONTS.fontSemiBold,fontSize:18,color:colors.title,marginBottom:12}}>Distance Range</Text>
                    <Text style={{...FONTS.fontSemiBold,fontSize:16,color:colors.text}}>Bookworm searching for someone to share literary discussions and quiet moments.</Text>
                </View>
            </View>
            <ScrollView 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1}}
            >
                <View style={[GlobalStyleSheet.container,{ paddingHorizontal:25,paddingTop:0}]}>
                    <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'}}>
                        <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Interests</Text>
                        <Text style={[FONTS.fontNunitoRegular,{fontSize:12,color:colors.text}]}>{Math.round(distanceVal[0])} KM</Text>
                    </View>
                    <Slider
                        value={distanceVal} // e.g. [10]
                        onValueChange={(val) => setDistanceVal(val)}
                        minimumValue={1}
                        maximumValue={100}
                        step={1}
                        allowTouchTrack
                        trackStyle={{
                            height: 3,
                            borderRadius: 40,
                            backgroundColor: theme.dark
                            ? 'rgba(255,255,255,0.10)'
                            : 'rgba(0,0,0,0.10)',
                        }}
                        minimumTrackTintColor={COLORS.primary}
                        thumbStyle={{
                            height: 16,
                            width: 16,
                            borderRadius: 8,
                            backgroundColor: COLORS.primary,
                            top: 1,
                        }}
                    />
                    <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'}}>
                        <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Age Range</Text>
                        <Text style={[FONTS.fontNunitoRegular,{fontSize:12,color:colors.text}]}>{ageValue[0]} - {ageValue[1]}</Text>
                    </View>
                    <Slider
                        value={ageValue}             
                        onValueChange={(val: any) => setAgeValue(val)}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        minimumTrackTintColor={COLORS.primary}
                        thumbStyle={{
                            height: 16,
                            width: 16,
                            borderRadius: 8,
                            backgroundColor: COLORS.primary,
                        }}
                        trackStyle={{
                            height: 3,
                            borderRadius: 40,
                            backgroundColor: theme.dark
                            ? 'rgba(255,255,255,0.10)'
                            : 'rgba(0,0,0,0.10)',
                        }}
                    />
                    <View style={{ marginBottom: 5 }}>
                        <Text style={[FONTS.fontBold, { fontSize: 24, color: colors.title }]}>
                            Search Preference
                        </Text>
                        <View style={[GlobalStyleSheet.row, { gap: 12, paddingVertical: 15 }]}>
                            {SearchPreferneceoptions.map((option: any) => {
                                const isSelected = selectedOptions.includes(option);
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        activeOpacity={0.8}
                                        style={[
                                            {
                                                paddingHorizontal: 18,
                                                paddingVertical: 10,
                                                borderWidth: 1,
                                                borderRadius: 50,
                                                borderColor: theme.dark
                                                    ? 'rgba(255,255,255,0.20)'
                                                    : 'rgba(0,0,0,0.20)',
                                            },
                                            isSelected && {
                                                borderColor: COLORS.primary,
                                                backgroundColor: COLORS.primary,
                                            },
                                        ]}
                                    onPress={() => toggleOption(option)}
                                    >
                                        <Text
                                            style={[
                                                FONTS.fontSemiBold,
                                                {
                                                    fontSize: 14,
                                                    color: isSelected ? COLORS.white : colors.title,
                                                },
                                            ]}
                                        >
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={{marginBottom:5}}>
                        <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Interests</Text>
                        <View style={[GlobalStyleSheet.row, { gap: 12, paddingVertical: 15, flexWrap: 'wrap' }]}>
                            {InterestsOption.map((data: any, index) => {
                                const isSelected = selectedInterests.includes(data.option);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.8}
                                        style={[
                                            {
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                                paddingHorizontal: 17,
                                                paddingVertical: 10,
                                                borderWidth: 1,
                                                borderRadius: 50,
                                                borderColor: theme.dark
                                                ? 'rgba(255,255,255,0.20)'
                                                : 'rgba(0,0,0,0.20)',
                                            },
                                            isSelected && {
                                                borderColor: COLORS.primary,
                                                backgroundColor: COLORS.primary,
                                            },
                                        ]}
                                        onPress={() => toggleInterest(data.option)}
                                    >
                                        <Text
                                            style={[
                                                FONTS.fontSemiBold,
                                                {
                                                    fontSize: 14,
                                                    color: isSelected ? COLORS.white : colors.title,
                                                },
                                            ]}
                                        >
                                            {data.option}
                                        </Text>

                                        <Image
                                            style={{
                                                height: 20,
                                                width: 20,
                                            }}
                                            resizeMode="contain"
                                            source={data.image}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={{marginBottom:5}}>
                        <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Languages I Know</Text>
                        <View style={[GlobalStyleSheet.row, { gap: 12, paddingVertical: 15, flexWrap: 'wrap' }]}>
                            {LanguagesData.map((data: any, index) => {
                                const isSelected = selectedLanguages.includes(data.name);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.8}
                                        style={[
                                            {
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                                paddingHorizontal: 17,
                                                paddingVertical: 10,
                                                borderWidth: 1,
                                                borderRadius: 50,
                                                borderColor: theme.dark
                                                ? 'rgba(255,255,255,0.20)'
                                                : 'rgba(0,0,0,0.20)',
                                            },
                                            isSelected && {
                                                borderColor: COLORS.primary,
                                                backgroundColor: COLORS.primary,
                                            },
                                        ]}
                                        onPress={() => toggleLanguage(data.name)}
                                    >
                                        <Text
                                        style={[
                                                FONTS.fontSemiBold,
                                                { fontSize: 14, color: isSelected ? COLORS.white : colors.title },
                                            ]}
                                        >
                                            {data.name}
                                        </Text>

                                        <Image
                                            style={{
                                                height: 20,
                                                width: 20,
                                            }}
                                            resizeMode="contain"
                                            source={data.flag}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={{marginBottom:5}}>
                        <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Religion</Text>
                        <View style={[GlobalStyleSheet.row, { gap: 12, paddingVertical: 15, flexWrap: 'wrap' }]}>
                            {ReligionData.map((option: string, index: number) => {
                                const isSelected = selectedReligions.includes(option);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.8}
                                        style={[
                                            {
                                                paddingHorizontal: 18,
                                                paddingVertical: 10,
                                                borderWidth: 1,
                                                borderRadius: 50,
                                                borderColor: theme.dark
                                                ? 'rgba(255,255,255,0.20)'
                                                : 'rgba(0,0,0,0.20)',
                                            },
                                            isSelected && {
                                                borderColor: COLORS.primary,
                                                backgroundColor: COLORS.primary,
                                            },
                                        ]}
                                        onPress={() => toggleReligion(option)}
                                    >
                                        <Text
                                            style={[
                                                FONTS.fontSemiBold,
                                                {
                                                fontSize: 14,
                                                color: isSelected ? COLORS.white : colors.title,
                                                },
                                            ]}
                                        >
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={{marginBottom:5}}>
                        <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Relationship Goals</Text>
                        <View style={[GlobalStyleSheet.row, { gap: 12, paddingVertical: 15, flexWrap: 'wrap' }]}>
                            {RelationshipData.map((data: any, index) => {
                                const isSelected = selectedRelationships.includes(data.name);

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.8}
                                        style={[
                                            {
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                                paddingHorizontal: 17,
                                                paddingVertical: 10,
                                                borderWidth: 1,
                                                borderRadius: 50,
                                                borderColor: theme.dark
                                                ? 'rgba(255,255,255,0.20)'
                                                : 'rgba(0,0,0,0.20)',
                                            },
                                            isSelected && {
                                                borderColor: COLORS.primary,
                                                backgroundColor: COLORS.primary,
                                            },
                                        ]}
                                        onPress={() => toggleRelationship(data.name)}
                                    >
                                        <Text
                                            style={[
                                                FONTS.fontSemiBold,
                                                {
                                                fontSize: 14,
                                                color: isSelected ? COLORS.white : colors.title,
                                                },
                                            ]}
                                        >
                                            {data.name}
                                        </Text>

                                        <Image
                                            style={{
                                                height: 20,
                                                width: 20,
                                            }}
                                            resizeMode="contain"
                                            source={data.image}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:15}]}>
                <View style={{flex:1}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => filterSheetRef.current.close()} 
                        style={{
                            padding:12,
                            borderWidth:1,
                            borderColor:COLORS.primary,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:15
                        }}
                    >
                        <Text style={[FONTS.fontSemiBold,{fontSize:18,color:COLORS.primary}]}>Reset</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => filterSheetRef.current.close()} 
                        style={{
                            padding:12,
                            backgroundColor:COLORS.primary,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:15
                        }}
                    >
                        <Text style={[FONTS.fontSemiBold,{fontSize:18,color:COLORS.white}]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </RBSheet>
    )
})

export default FilterSheet;