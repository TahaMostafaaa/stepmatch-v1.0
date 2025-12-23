import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import ListStyle1 from '../../components/list/ListStyle1';
import { Snackbar } from 'react-native-paper';


const Snackbars = () => {

     const { colors }: {colors : any} = useTheme();

    const [visible, setVisible] = React.useState(false);
	const [snackText, setSnackText] = React.useState("");
	const [snackType, setSnackType] = React.useState("");
	
	const onDismissSnackBar = () => setVisible(false);

    const onToggleSnackBar = (type:any,text:any) => {
		setSnackText(text);
		setSnackType(type);
		setVisible(!visible);
	};
    return (
        <>
            <SafeAreaView style={{flex:1}}>
                <Header title={'Snackbars'} titleLeft leftIcon={'back'}/>
                <ScrollView>
                    <View style={{...GlobalStyleSheet.container}}>
                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('success',"Something's wrong!")}
                                    arrowRight
                                    icon={<FontAwesome size={20} color={colors.title} name={'check'} />}
                                    title={'Confirmation Snackbar'}
                                />
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('warning',"Something's wrong!")}
                                    arrowRight
                                    icon={<FontAwesome size={20} color={colors.title} name={'warning'} />}
                                    title={'Warning Snackbar'}
                                />
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('info',"We're on it")}
                                    arrowRight
                                    icon={<FontAwesome size={20} color={colors.title} name={'refresh'} />}
                                    title={'Loading Snackbar'}
                                />
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('error',"Error Occured")}
                                    arrowRight
                                    icon={<FontAwesome size={20} color={colors.title} name={'close'} />}
                                    title={'Error Snackbar'}
                                />
                            </View>
                    </View>
                </ScrollView>
                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    style={{
                        backgroundColor:
                            snackType === 'success' ? '#4CAF50' : // Green
                            snackType === 'warning' ? '#FFC107' : // Amber
                            snackType === 'info'    ? '#2196F3' : // Blue
                            snackType === 'error'   ? '#F44336' : // Red
                            colors.primary
                    }}
                >
                    {snackText}
                </Snackbar>
            </SafeAreaView>
        </>
    );
};


export default Snackbars;