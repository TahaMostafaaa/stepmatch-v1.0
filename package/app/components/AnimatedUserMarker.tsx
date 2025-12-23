import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet } from 'react-native';
import { COLORS, IMAGES } from '../constants/theme';

const AnimatedUserMarker = () => {
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.2)).current;
  const opacity3 = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    const createPulse = (scale : any, opacity : any, delay : any) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 2.5,
              duration: 3000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 3000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createPulse(scale1, opacity1, 0);
    createPulse(scale2, opacity2, 1000);
    createPulse(scale3, opacity3, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Pulse Layers */}
      <Animated.View
        style={[
          styles.pulse,
          { backgroundColor: COLORS.primary, opacity: opacity1, transform: [{ scale: scale1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.pulse,
          { backgroundColor: COLORS.primary, opacity: opacity2, transform: [{ scale: scale2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.pulse,
          { backgroundColor: COLORS.primary, opacity: opacity3, transform: [{ scale: scale3 }] },
        ]}
      />

      {/* Profile Image */}
      <View style={styles.avatarBorder}>
        <Image
          source={IMAGES.likedPic1}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 60,
  },
  avatarBorder: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default AnimatedUserMarker;
