import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useRoute, useTheme } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

type VideoScreenProps = NativeStackScreenProps<RootStackParamList, 'Video'>;

const Video = ({ navigation }: VideoScreenProps) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [showVideo, setshowVideo] = React.useState(true);
    const [showMic, setshowMic] = React.useState(true);
    const [showvolume, setshowvolume] = React.useState(true);
    
    const [mainImage, setMainImage] = React.useState(IMAGES.likedPic1);

    const toggleBackgroundImage = () => {
        setMainImage((prev: any) =>
          prev === IMAGES.likedPic1 ? IMAGES.likedPic5 : IMAGES.likedPic1
      );
    };
  
  const route = useRoute<any>();

  // const { data } = route.params;

  return (
      <View style={[GlobalStyleSheet.container, { flex: 1, padding: 0 }]}>
        <ImageBackground
          style={{
            height: '100%',
            width: '100%',
          }}
          source={mainImage} 
        >
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,.4)']}
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              top: 0,
              borderRadius: 20,
              justifyContent: 'flex-end',
            }}
          />
          <View
            style={{
              padding: 15,
              flex: 1,
              paddingTop: 60,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <View
              style={[
                GlobalStyleSheet.flexCenter,
                {
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  backgroundColor: colors.card,
                  borderRadius: 15,
                  left:15,
                  right:15,
                  top:15,
                  position:'absolute'
                },
              ]}
            >
              <View style={[GlobalStyleSheet.flexaling, { flex: 1, gap: 14 }]}>
                <Image
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 50,
                  }}
                  source={IMAGES.likedPic2}
                />
                <View>
                  <Text
                    style={[
                      FONTS.fontSemiBold,
                      {
                        fontSize: 18,
                        color: theme.dark ? colors.title : '#191919',
                      },
                    ]}
                  >
                    Harper
                  </Text>
                  <Text
                    style={[
                      FONTS.fontNunitoRegular,
                      {
                        fontSize: 14,
                        color: theme.dark ? colors.title : '#191919',
                      },
                    ]}
                  >
                    15:20
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  GlobalStyleSheet.headerBtn,
                  {
                    height: 48,
                    width: 48,
                    backgroundColor: theme.dark
                      ? colors.background
                      : 'rgba(25,25,25,0.10)',
                    transform: [{ rotate: '-90deg' }],
                  },
                ]}
              >
                <Feather name="minimize-2" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 30 }}>
              <TouchableOpacity
                onPress={toggleBackgroundImage} // 👈 Toggle on click
                activeOpacity={0.8}
                style={{
                  height: 170,
                  width: 120,
                  borderRadius: 15,
                  overflow: 'hidden',
                  position: 'absolute',
                  bottom: 80,
                  right: -10,
                }}
              >
                <Image
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  resizeMode="cover"
                  source={mainImage === IMAGES.likedPic1 ? IMAGES.likedPic5 : IMAGES.likedPic1}
                />
              </TouchableOpacity>

              <View
                style={[
                  GlobalStyleSheet.flexCenter,
                  { justifyContent: 'center', gap: 18 },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    GlobalStyleSheet.headerBtn,
                    {
                      backgroundColor: colors.card,
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Feather name="rotate-ccw" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setshowVideo(!showVideo)}
                  activeOpacity={0.8}
                  style={[
                    GlobalStyleSheet.headerBtn,
                    {
                      backgroundColor: colors.card,
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Feather
                    name={showVideo ? 'video' : 'video-off'}
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setshowMic(!showMic)}
                  activeOpacity={0.8}
                  style={[
                    GlobalStyleSheet.headerBtn,
                    {
                      backgroundColor: colors.card,
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Feather
                    name={showMic ? 'mic' : 'mic-off'}
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setshowvolume(!showvolume)}
                  activeOpacity={0.8}
                  style={[
                    GlobalStyleSheet.headerBtn,
                    {
                      backgroundColor: colors.card,
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                    },
                    !showvolume && {
                      backgroundColor: COLORS.primary,
                    },
                  ]}
                >
                  <Feather
                    name="volume-2"
                    size={24}
                    color={showvolume ? colors.text : COLORS.white}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.8}
                  style={[
                    GlobalStyleSheet.headerBtn,
                    {
                      backgroundColor: COLORS.primary,
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Feather name="phone" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
  );
};

export default Video;
