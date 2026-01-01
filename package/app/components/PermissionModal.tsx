// components/PermissionModal.tsx
import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { useTheme } from '@react-navigation/native';

const PermissionModal = ({ visible, icon, title, description, onAllow, onSkip }: any) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme;

    return (
        <Modal 
            transparent 
            visible={visible} 
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalBox,{backgroundColor:colors.card}]}>
                    <View style={[styles.iconbg]}>
                        <Image source={icon} style={styles.icon} />
                    </View>
                    <Text style={[FONTS.fontBold, styles.title,{color:theme.dark ? colors.title : '#191919'}]}>{title}</Text>
                    <Text style={[FONTS.fontNunitoRegular, styles.desc,{color:colors.text}]}>{description}</Text>

                    <TouchableOpacity style={styles.allowBtn} onPress={onAllow}>
                        <Text style={[styles.allowText,{color:COLORS.white}]}>Allow Access</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onSkip}
                        style={{
                            paddingHorizontal:52,
                            paddingVertical:12,
                            borderRadius:15,
                        }}
                    >
                        <Text style={[styles.skipText,{color:theme.dark ? colors.text : '#999999'}]}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PermissionModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.40)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '75%',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 35,
        paddingBottom:10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    icon: {
        width: 70,
        height: 70,
    },
    iconbg:{
        height:100,
        width:100,
        borderRadius:30,
        backgroundColor:COLORS.primayLight,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:30
    },
    title: {
        fontSize: 22,
        textAlign:'center'
    },
    desc: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
    },
    allowBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 52
    },
    allowText: {
        ...FONTS.fontSemiBold,
        fontSize: 18,
    },
    skipText: {
        ...FONTS.fontSemiBold,
        fontSize: 14,
    },
});
