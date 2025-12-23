import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

const ToggleStyle4 = (props: any) => {
    const { colors }: { colors: any } = useTheme();
    const [active, setActive] = useState(false);

    const offset = useRef(new Animated.Value(0)).current;

    const handleToggle = () => {
        const newActive = !active;
        setActive(newActive);

        Animated.spring(offset, {
        toValue: newActive ? 30 : 0,
        useNativeDriver: true,
        }).start();
    };

    return (
        <View
            style={{
                height: 32,
                justifyContent: 'center',
            }}
        >
            <TouchableOpacity
                onPress={handleToggle}
                activeOpacity={0.8}
                style={{
                    height: 17,
                    width: 55,
                    backgroundColor: active ? COLORS.primayLight : '#aab2bd',
                    borderRadius: 30,
                }}
            >
                <Animated.View
                    style={{
                        height: 28,
                        width: 28,
                        borderRadius: 30,
                        backgroundColor: active ? COLORS.primary : colors.cardBg,
                        borderWidth: 1,
                        borderColor: active ? COLORS.primary : colors.borderColor,
                        position: 'absolute',
                        top: -5,
                        left: -2,
                        transform: [{ translateX: offset }],
                        shadowColor: 'rgba(0,0,0,.6)',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        elevation: 8,
                    }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default ToggleStyle4;
