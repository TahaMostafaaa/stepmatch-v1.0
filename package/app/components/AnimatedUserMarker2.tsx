import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet } from 'react-native';
import { COLORS, IMAGES } from '../constants/theme';

const AnimatedUserMarker2 = () => {
  // Define 4 layered pulse settings
  const pulseLayers = [
    { opacity: 0.4, delay: 0, size: 2.0 },   // strongest (40%)
    { opacity: 0.3, delay: 800, size: 3.0 }, // medium (30%)
    { opacity: 0.2, delay: 1600, size: 4.0 }, // soft (20%)
    { opacity: 0.1, delay: 2400, size: 5.0 }, // farthest (10%)
  ];

  // Animated values for each layer
  const scales = useRef(pulseLayers.map(() => new Animated.Value(1))).current;
  const opacities = useRef(pulseLayers.map((l) => new Animated.Value(l.opacity))).current;

  useEffect(() => {
    pulseLayers.forEach((layer, index) => {
      const scale = scales[index];
      const opacity = opacities[index];

      const pulse = () => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(layer.delay),
            Animated.parallel([
              Animated.timing(scale, {
                toValue: layer.size,
                duration: 3500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 3500,
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
              toValue: layer.opacity,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      pulse();
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* 4 Pulsing Layers */}
      {pulseLayers.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.pulse,
            {
              backgroundColor: COLORS.primary,
              opacity: opacities[i],
              transform: [{ scale: scales[i] }],
            },
          ]}
        />
      ))}

      {/* Center Avatar */}
      <View style={styles.avatarBorder}>
        <Image source={IMAGES.likedPic1} style={styles.avatar} />
      </View>
    </View>
  );
};

const BASE_SIZE = 160; // Avatar + initial pulse radius

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: BASE_SIZE * 2.2, // base size for larger circles
    height: BASE_SIZE * 2.2,
    borderRadius: (BASE_SIZE * 2.2) / 2,
  },
  avatarBorder: {
    width: BASE_SIZE,
    height: BASE_SIZE,
    borderRadius: BASE_SIZE / 2,
    borderWidth: 6,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: BASE_SIZE / 2,
  },
});

export default AnimatedUserMarker2;
