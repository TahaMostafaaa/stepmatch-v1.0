import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

const ToggleStyle5 = (props: any) => {
  const theme = useTheme();
  const [active, setActive] = useState(false);

  // Animated value
  const offset = useRef(new Animated.Value(0)).current;

  // Handle initial prop-based active state
  useEffect(() => {
    if (props.active) {
      setActive(true);
      Animated.spring(offset, {
        toValue: 28,
        useNativeDriver: true,
      }).start();
    }
  }, [props.active]);

  const toggleSwitch = () => {
    const newActive = !active;
    setActive(newActive);

    props.onToggle && props.onToggle(newActive);

    Animated.spring(offset, {
      toValue: newActive ? 28 : 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      activeOpacity={0.8}
      style={{
        height: 22,
        width: 40,
        borderColor: active
          ? COLORS.primary
          : theme.dark
          ? 'rgba(255,255,255,.1)'
          : '#141414',
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Animated.View
        style={{
          height: 14,
          width: 14,
          borderRadius: 30,
          backgroundColor: active
            ? COLORS.primary
            : theme.dark
            ? 'rgba(255,255,255,.1)'
            : '#141414',
          transform: [{ translateX: offset }],
          marginLeft: 3,
        }}
      />
    </TouchableOpacity>
  );
};

export default ToggleStyle5;
