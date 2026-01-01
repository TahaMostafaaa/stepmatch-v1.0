import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamList';

import Components from '../Screens/Components/Components';
import AccordionScreen from '../Screens/Components/Accordion';
import ActionSheet from '../Screens/Components/ActionSheet';
import ActionModals from '../Screens/Components/ActionModals';
import Buttons from '../Screens/Components/Buttons';
import Charts from '../Screens/Components/Charts';
import Chips from '../Screens/Components/Chips';
import CollapseElements from '../Screens/Components/CollapseElements';
import DividerElements from '../Screens/Components/DividerElements';
import FileUploads from '../Screens/Components/FileUploads';
import Headers from '../Screens/Components/Headers';
import Inputs from '../Screens/Components/Inputs';
import ListScreen from '../Screens/Components/Lists';
import Paginations from '../Screens/Components/Paginations';
import Pricings from '../Screens/Components/Pricings';
import Snackbars from '../Screens/Components/Snackbars';
import Socials from '../Screens/Components/Socials';
import SwipeableScreen from '../Screens/Components/Swipeable';
import Tabs from '../Screens/Components/Tabs';
import Tables from '../Screens/Components/Tables';
import Toggles from '../Screens/Components/Toggles';
import Footers from '../Screens/Components/Footers';
import TabStyle1 from '../components/Footers/FooterStyle1';
import TabStyle2 from '../components/Footers/FooterStyle2';
import TabStyle3 from '../components/Footers/FooterStyle3';
import TabStyle4 from '../components/Footers/FooterStyle4';

import DrawerNavigation from './DrawerNavigation';
import OnBoarding from '../pages/Splash/OnBoarding';
import SingleChat from '../pages/Chats/SingleChat';
import EditProfile from '../pages/Profile/EditProfile';
import Settings from '../pages/Settings';
import AMatch from '../pages/itsaMatch/AMatch';
import SignUp from '../pages/Auth/SignUp';
import Login from '../pages/Auth/Login';
import NearbyYou from '../pages/Explore/NearbyYou';
import Video from '../pages/Chats/Video';
import PrivacyPolicy from '../pages/Profile/PrivacyPolicy';
import TermsandConditions from '../pages/Profile/TermsandConditions';
import ContactUs from '../pages/Profile/ContactUs';
import SafetyPolicy from '../pages/Profile/SafetyPolicy';
import AccountSecurity from '../pages/Profile/AccountSecurity';
import HelpCenter from '../pages/Profile/HelpCenter';
import Faq from '../pages/Profile/Faq';
import Subscription from '../pages/Subscription/Subscription';
import NearbyYou2 from '../pages/Explore/NearbyYou2';
import NearbyYou3 from '../pages/Explore/NearbyYou3';
import Notifications from '../pages/Notifications/Notifications';
import FirstName from '../pages/info/FirstName';
import EnterBirthDate from '../pages/info/EnterBirthDate';
import YourGender from '../pages/info/YourGender';
import Orientation from '../pages/info/Orientation';
import Intrested from '../pages/info/Intrested';
import LookingFor from '../pages/info/LookingFor';
import RecentPics from '../pages/info/RecentPics';
import Splash from '../pages/Splash/Splash';
import language from '../pages/Language/language';


const MyStatusBar = ({ ...props }) => (
    <View style={[styles.statusBar]}>
        <StatusBar translucent backgroundColor="transparent" {...props} />
    </View>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
    // #region agent log
    React.useEffect(() => {
      fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'StackNavigator.tsx:74',message:'StackNavigator rendering',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }, []);
    // #endregion
    
    const theme = useTheme();

    const { colors }: {colors : any} = useTheme();

    return (
        <View style={[styles.container,{backgroundColor:colors.card}]}>
            <MyStatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
            <Stack.Navigator
                initialRouteName={"Splash"}
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: "transparent",flex:1 },
                }}
            >
                <Stack.Screen name={"Splash"} component={Splash} />
                <Stack.Screen name={"OnBoarding"} component={OnBoarding} />
                <Stack.Screen name={"SignUp"} component={SignUp} />
                <Stack.Screen name={"Login"} component={Login} />
                <Stack.Screen name={"FirstName"} component={FirstName} />
                <Stack.Screen name={"EnterBirthDate"} component={EnterBirthDate} />
                <Stack.Screen name={"YourGender"} component={YourGender} />
                <Stack.Screen name={"Orientation"} component={Orientation} />
                <Stack.Screen name={"Intrested"} component={Intrested} />
                <Stack.Screen name={"LookingFor"} component={LookingFor} />
                <Stack.Screen name={"RecentPics"} component={RecentPics} /> 
                <Stack.Screen name={"DrawerNavigation"} component={DrawerNavigation} />
                <Stack.Screen name={"NearbyYou"} component={NearbyYou} />
                <Stack.Screen name={"NearbyYou2"} component={NearbyYou2} />
                <Stack.Screen name={"NearbyYou3"} component={NearbyYou3} />
                <Stack.Screen name={"AMatch"} component={AMatch} />
                <Stack.Screen name={"Notifications"} component={Notifications} />
                <Stack.Screen name={"SingleChat"} component={SingleChat} />
                <Stack.Screen name={"Video"} component={Video} />
                <Stack.Screen name={"EditProfile"} component={EditProfile} />
                <Stack.Screen name={"Settings"} component={Settings} />
                <Stack.Screen name={"PrivacyPolicy"} component={PrivacyPolicy} />
                <Stack.Screen name={"TermsandConditions"} component={TermsandConditions} />
                <Stack.Screen name={"ContactUs"} component={ContactUs} />
                <Stack.Screen name={"SafetyPolicy"} component={SafetyPolicy} />
                <Stack.Screen name={"AccountSecurity"} component={AccountSecurity} />
                <Stack.Screen name={"HelpCenter"} component={HelpCenter} />
                <Stack.Screen name={"Faq"} component={Faq} />
                <Stack.Screen name={"Subscription"} component={Subscription} />
                <Stack.Screen name={"Language"} component={language} />
                

                <Stack.Screen name={"Components"} component={Components} />
                <Stack.Screen name={"Accordion"} component={AccordionScreen} />
                <Stack.Screen name={"ActionSheet"} component={ActionSheet} />
                <Stack.Screen name={"ActionModals"} component={ActionModals} />
                <Stack.Screen name={"Buttons"} component={Buttons} />
                <Stack.Screen name={"Charts"} component={Charts} />
                <Stack.Screen name={"Chips"} component={Chips} />
                <Stack.Screen name={"CollapseElements"} component={CollapseElements} />
                <Stack.Screen name={"DividerElements"} component={DividerElements} />
                <Stack.Screen name={"FileUploads"} component={FileUploads} />
                <Stack.Screen name={"Headers"} component={Headers} />
                <Stack.Screen name={"Footers"} component={Footers} />
                <Stack.Screen name={"Inputs"} component={Inputs} />
                <Stack.Screen name={"lists"} component={ListScreen} />
                <Stack.Screen name={"Paginations"} component={Paginations} />
                <Stack.Screen name={"Pricings"} component={Pricings} />
                <Stack.Screen name={"Snackbars"} component={Snackbars} />
                <Stack.Screen name={"Socials"} component={Socials} />
                <Stack.Screen name={"Swipeable"} component={SwipeableScreen} />
                <Stack.Screen name={"Tabs"} component={Tabs} />
                <Stack.Screen name={"Tables"} component={Tables} />
                <Stack.Screen name={"Toggles"} component={Toggles} />
                <Stack.Screen name={"TabStyle1"} component={TabStyle1} />
                <Stack.Screen name={"TabStyle2"} component={TabStyle2} />
                <Stack.Screen name={"TabStyle3"} component={TabStyle3} />
                <Stack.Screen name={"TabStyle4"} component={TabStyle4} />

            </Stack.Navigator>
        </View>
    );
};

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop : STATUSBAR_HEIGHT,
    },
    statusBar: {
        height: 0,
    },
});

export default StackNavigator;