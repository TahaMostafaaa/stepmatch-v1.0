import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';

const ToggleStyle3 = (props: any) => {
    const { colors }: { colors: any } = useTheme();

    const [active, setActive] = useState(false);
    const offset = useRef(new Animated.Value(0)).current;

    const handleToggle = () => {
        const newActive = !active;
        setActive(newActive);

        Animated.spring(offset, {
        toValue: newActive ? 28 : 0,
        useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={handleToggle}
            activeOpacity={0.8}
            style={{
                height: 32,
                width: 60,
                backgroundColor: active ? COLORS.success : COLORS.danger,
                borderRadius: 30,
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                    justifyContent: 'space-around',
                }}
            >
                <Text
                    style={{
                        ...FONTS.font,
                        ...FONTS.fontBold,
                        fontSize: 10,
                        color: COLORS.white,
                    }}
                >
                    ON
                </Text>
                <Text
                    style={{
                        ...FONTS.font,
                        ...FONTS.fontBold,
                        fontSize: 10,
                        color: COLORS.white,
                    }}
                >
                    OFF
                </Text>
            </View>

            <Animated.View
                style={{
                    height: 28,
                    width: 28,
                    backgroundColor: '#fff',
                    borderRadius: 30,
                    top: 2,
                    left: 2,
                    transform: [{ translateX: offset }],
                }}
            />
        </TouchableOpacity>
    );
};

export default ToggleStyle3;
