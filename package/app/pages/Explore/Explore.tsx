import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';

const Explore = () => {

    const navigation = useNavigation<any>();

    const theme = useTheme();
    const { colors }: {colors : any} = theme;

    return (
        <>
          <View
              style={[GlobalStyleSheet.container,{
                  padding:0,
                  flex:1,
                  backgroundColor:colors.card,
              }]}
          > 
            <Header
              title={"Ditto"}
              leftIcon={'back'}
              rightIcon={'Notifaction'}
              explore
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  paddingHorizontal:15,
                  paddingTop:10
                }}
              >
                <Text style={[FONTS.fontBold,{fontSize:18,color:colors.title,marginBottom:10}]}>Welcome to Explore</Text>
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('NearbyYou')}
                    activeOpacity={0.8}
                    style={{
                      height:200,
                      padding:13,
                      borderRadius:16,
                      backgroundColor:'#BF7DEF',
                      marginBottom:12,
                      overflow:'hidden'
                    }}
                  >
                    <Text style={[FONTS.fontBold,{fontSize:18,color:COLORS.white,textAlign:'left',flex:1,textTransform:'capitalize'}]}>long-term partner</Text>
                    <View
                      style={{
                        alignItems:'center'
                      }}
                    >
                      <Image
                        style={{
                          height:140,
                          width:150
                        }}
                        resizeMode='contain'
                        source={IMAGES.partner}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('NearbyYou2')}
                    activeOpacity={0.8}
                    style={{
                      height:200,
                      padding:13,
                      borderRadius:16,
                      backgroundColor:'#FF5F2F',
                      marginBottom:12,
                      overflow:'hidden'
                    }}
                  >
                    <Text style={[FONTS.fontBold,{fontSize:18,color:COLORS.white,textAlign:'left',flex:1,textTransform:'capitalize'}]}>Serious Daters</Text>
                    <View
                      style={{
                        alignItems:'center'
                      }}
                    >
                      <Image
                        style={{
                          height:150,
                          width:150
                        }}
                        resizeMode='contain'
                        source={IMAGES.Daters}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('NearbyYou3')}
                    activeOpacity={0.8}
                    style={{
                      height:200,
                      padding:13,
                      borderRadius:16,
                      backgroundColor:'#009DD0',
                      marginBottom:12,
                      overflow:'hidden'
                    }}
                  >
                    <Text style={[FONTS.fontBold,{fontSize:18,color:COLORS.white,textAlign:'left',flex:1,textTransform:'capitalize'}]}>Free Tonight</Text>
                    <View
                      style={{
                        alignItems:'center',
                        position:'absolute',
                        left:0,
                        right:0,
                        bottom:-10
                      }}
                    >
                      <Image
                        style={{
                          height:175,
                          width:'100%'
                        }}
                        resizeMode='contain'
                        source={IMAGES.Tonight}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </>
    )
}

export default Explore