import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from '@expo/vector-icons';
import uuid from "react-native-uuid";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";

const FileUploads = () => {

  const { colors } : {colors : any} = useTheme();
  const [imageData, setImageData] = useState<any>([]);

  const uploadFile = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission Denied", "Allow access to your gallery to pick an image.");
    }

    // Open gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageData([...imageData, { id: uuid.v4(), image: result.assets[0].uri }]);
    }
  };

  const removeImageItem = (index: any) => {
    setImageData([...imageData.slice(0, index), ...imageData.slice(index + 1)]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header titleLeft title={"File Upload"} leftIcon={"back"} />
      <ScrollView>
        <View style={GlobalStyleSheet.container}>
          <View
            style={[
              GlobalStyleSheet.card,
              GlobalStyleSheet.shadow,
              { backgroundColor: colors.cardBg, borderColor: colors.borderColor },
            ]}
          >
            <View style={{ borderBottomColor: colors.borderColor, marginBottom: 15 }}>
              <Text style={{ ...FONTS.h6, color: colors.title }}>Upload Image</Text>
            </View>

            {imageData.length === 0 && (
              <TouchableOpacity
                onPress={uploadFile}
                activeOpacity={0.8}
                style={{
                  height: 120,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderRadius: SIZES.radius,
                  marginBottom: 10,
                  borderColor: colors.borderColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="image" color={colors.borderColor} size={40} />
              </TouchableOpacity>
            )}

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginHorizontal: -5,
                marginBottom: 10,
              }}
            >
              {imageData.length > 0 &&
                imageData.map((data:any, index:any) => (
                  <View key={index} style={{ width: "33.33%", paddingHorizontal: 5 }}>
                    <View style={{ height: 110, position: "relative", marginBottom: 10 }}>
                      <TouchableOpacity
                        onPress={() => removeImageItem(index)}
                        activeOpacity={0.8}
                        style={{
                          height: 25,
                          width: 25,
                          borderRadius: 20,
                          position: "absolute",
                          top: -5,
                          right: -5,
                          zIndex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: COLORS.danger,
                        }}
                      >
                        <Feather name="x" size={16} color={COLORS.white} />
                      </TouchableOpacity>
                      <Image
                        source={{ uri: data.image }}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: SIZES.radius,
                        }}
                      />
                    </View>
                  </View>
                ))}
            </View>

            <Button onPress={uploadFile} title={"Upload Image"} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FileUploads;
