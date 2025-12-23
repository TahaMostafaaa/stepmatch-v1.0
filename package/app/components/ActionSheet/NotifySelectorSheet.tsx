import { useTheme } from '@react-navigation/native';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FONTS } from '../../constants/theme';

const options = [
  "5 min Before",
  "15 min Before",
  "30 min Before",
  "1 hour Before",
  "2 hours Before",
];

const NotifySelectorSheet = forwardRef(({ onSelect }, ref) => {


    const sheetRef = useRef('');

    // Expose functions to parent
    useImperativeHandle(ref, () => ({
        open: () => sheetRef.current.open(),
        close: () => sheetRef.current.close(),
    }));

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    return (
        <RBSheet
            ref={sheetRef}
            height={300}
            openDuration={250}
            customStyles={{
                container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                backgroundColor: colors.card,
                },
            }}
        >
            <View>
                <Text style={{...FONTS.fontBold, fontSize: 18,  marginBottom: 15,color:colors.title }}>
                    Notify Before
                </Text>

                {options.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            onSelect(item);
                            sheetRef.current.close();
                        }}
                        style={{
                            paddingVertical: 12,
                            borderBottomWidth: index !== options.length - 1 ? 1 : 0,
                            borderBottomColor: colors.borderColor,
                        }}
                    >
                        <Text style={{ fontSize: 16, color:colors.text  }}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </RBSheet>
    );
});

export default NotifySelectorSheet;
