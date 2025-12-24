import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

const ToggleStyle1 = (props: any) => {
  const theme = useTheme();
  const [active, setActive] = useState(false);

  // create animated value
  const offset = useRef(new Animated.Value(0)).current;

    // handle initial state from props
    useEffect(() => {
      setActive(props.active || false);
      Animated.spring(offset, {
        toValue: props.active ? 17 : 0,
        useNativeDriver: true,
      }).start();
    }, [props.active]);

    // handle toggle
    const handleToggle = () => {
      const newActive = !active;
      setActive(newActive);
      props.onToggle && props.onToggle(newActive);

      Animated.spring(offset, {
        toValue: newActive ? 17 : 0,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.8}
        style={{
          height: 22,
          width: 40,
          backgroundColor: active
            ? COLORS.primary
            : theme.dark
            ? 'rgba(255,255,255,.1)'
            : '#e8e9ea',
          borderRadius: 20,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            height: 14,
            width: 14,
            borderRadius: 10,
            backgroundColor: COLORS.white,
            transform: [{ translateX: offset }],
            marginLeft: 4,
          }}
        />
      </TouchableOpacity>
    );
  };

export default ToggleStyle1;
