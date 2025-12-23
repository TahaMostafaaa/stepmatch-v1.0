import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/theme';


const MsgComponent = ({item,sender} : any) => {

     const { colors }: {colors : any} = useTheme();
    const theme = useTheme();

    return (
        <>
            <View style={[
                {
                    alignItems:'flex-start',
                    marginRight:'25%',
                    marginBottom:15,
                },
                sender && {
                    alignItems:'flex-end',
                    marginLeft:'25%',
                    marginRight:0,
                }
            ]}>
                <View
                    style={[
                        {
                            backgroundColor : theme.dark ?  colors.background : "#eee",
                            borderRadius:8,
                            paddingHorizontal:15,
                            paddingVertical:12,
                        },
                        sender && {
                            backgroundColor:COLORS.primary,
                        }
                    ]}
                >
                    <Text style={[{
                        ...FONTS.font,
                        ...FONTS.fontMedium,
                        color:colors.title,
                    }, sender && {
                        color: COLORS.white,
                    }]}>{item.msg}</Text>
                </View>
                <Text style={{...FONTS.font,color:colors.textLight,marginTop:4}}>{item.time}</Text>
            </View>
        </>
    );
};

export default MsgComponent;