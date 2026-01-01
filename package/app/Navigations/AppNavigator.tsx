/**
 * App Navigator
 * 
 * Navigation stack for authenticated users.
 * Contains all protected screens that require authentication.
 * 
 * This navigator is shown when the user IS authenticated.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all app screens
import DrawerNavigation from './DrawerNavigation';
import SingleChat from '../pages/Chats/SingleChat';
import EditProfile from '../pages/Profile/EditProfile';
import Settings from '../pages/Settings';
import AMatch from '../pages/itsaMatch/AMatch';
import NearbyYou from '../pages/Explore/NearbyYou';
import NearbyYou2 from '../pages/Explore/NearbyYou2';
import NearbyYou3 from '../pages/Explore/NearbyYou3';
import Video from '../pages/Chats/Video';
import PrivacyPolicy from '../pages/Profile/PrivacyPolicy';
import TermsandConditions from '../pages/Profile/TermsandConditions';
import ContactUs from '../pages/Profile/ContactUs';
import SafetyPolicy from '../pages/Profile/SafetyPolicy';
import AccountSecurity from '../pages/Profile/AccountSecurity';
import HelpCenter from '../pages/Profile/HelpCenter';
import Faq from '../pages/Profile/Faq';
import Subscription from '../pages/Subscription/Subscription';
import Notifications from '../pages/Notifications/Notifications';
import FirstName from '../pages/info/FirstName';
import EnterBirthDate from '../pages/info/EnterBirthDate';
import YourGender from '../pages/info/YourGender';
import Orientation from '../pages/info/Orientation';
import Intrested from '../pages/info/Intrested';
import LookingFor from '../pages/info/LookingFor';
import RecentPics from '../pages/info/RecentPics';
import Language from '../pages/Language/language';

// Component screens (for demo/component library)
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

import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabParamList } from './BottomTabParamList';

// Type for app stack routes
export type AppStackParamList = {
  DrawerNavigation: NavigatorScreenParams<BottomTabParamList>;
  BottomNavigation: undefined;
  NearbyYou: undefined;
  NearbyYou2: undefined;
  NearbyYou3: undefined;
  Notifications: undefined;
  Video: undefined;
  AMatch: undefined;
  VideoCall: undefined;
  EditProfile: undefined;
  PrivacyPolicy: undefined;
  TermsandConditions: undefined;
  ContactUs: undefined;
  SafetyPolicy: undefined;
  AccountSecurity: undefined;
  HelpCenter: undefined;
  Faq: undefined;
  Language: undefined;
  Subscription: undefined;
  FirstName: undefined;
  EnterBirthDate: undefined;
  YourGender: undefined;
  Intrested: undefined;
  RecentPics: undefined;
  Orientation: undefined;
  LookingFor: undefined;
  SingleChat: undefined;
  Settings: undefined;
  // Component screens
  Components: undefined;
  Accordion: undefined;
  ActionSheet: undefined;
  ActionModals: undefined;
  Buttons: undefined;
  Charts: undefined;
  Chips: undefined;
  CollapseElements: undefined;
  DividerElements: undefined;
  FileUploads: undefined;
  Headers: undefined;
  Footers: undefined;
  Inputs: undefined;
  lists: undefined;
  Paginations: undefined;
  Pricings: undefined;
  Snackbars: undefined;
  Socials: undefined;
  Swipeable: undefined;
  Tabs: undefined;
  Tables: undefined;
  Toggles: undefined;
  TabStyle1: undefined;
  TabStyle2: undefined;
  TabStyle3: undefined;
  TabStyle4: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="DrawerNavigation"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Main app screens */}
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="NearbyYou" component={NearbyYou} />
      <Stack.Screen name="NearbyYou2" component={NearbyYou2} />
      <Stack.Screen name="NearbyYou3" component={NearbyYou3} />
      <Stack.Screen name="AMatch" component={AMatch} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="SingleChat" component={SingleChat} />
      <Stack.Screen name="Video" component={Video} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsandConditions" component={TermsandConditions} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="SafetyPolicy" component={SafetyPolicy} />
      <Stack.Screen name="AccountSecurity" component={AccountSecurity} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
      <Stack.Screen name="Faq" component={Faq} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Language" component={Language} />
      
      {/* Profile setup screens */}
      <Stack.Screen name="FirstName" component={FirstName} />
      <Stack.Screen name="EnterBirthDate" component={EnterBirthDate} />
      <Stack.Screen name="YourGender" component={YourGender} />
      <Stack.Screen name="Orientation" component={Orientation} />
      <Stack.Screen name="Intrested" component={Intrested} />
      <Stack.Screen name="LookingFor" component={LookingFor} />
      <Stack.Screen name="RecentPics" component={RecentPics} />
      
      {/* Component library screens */}
      <Stack.Screen name="Components" component={Components} />
      <Stack.Screen name="Accordion" component={AccordionScreen} />
      <Stack.Screen name="ActionSheet" component={ActionSheet} />
      <Stack.Screen name="ActionModals" component={ActionModals} />
      <Stack.Screen name="Buttons" component={Buttons} />
      <Stack.Screen name="Charts" component={Charts} />
      <Stack.Screen name="Chips" component={Chips} />
      <Stack.Screen name="CollapseElements" component={CollapseElements} />
      <Stack.Screen name="DividerElements" component={DividerElements} />
      <Stack.Screen name="FileUploads" component={FileUploads} />
      <Stack.Screen name="Headers" component={Headers} />
      <Stack.Screen name="Footers" component={Footers} />
      <Stack.Screen name="Inputs" component={Inputs} />
      <Stack.Screen name="lists" component={ListScreen} />
      <Stack.Screen name="Paginations" component={Paginations} />
      <Stack.Screen name="Pricings" component={Pricings} />
      <Stack.Screen name="Snackbars" component={Snackbars} />
      <Stack.Screen name="Socials" component={Socials} />
      <Stack.Screen name="Swipeable" component={SwipeableScreen} />
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Tables" component={Tables} />
      <Stack.Screen name="Toggles" component={Toggles} />
      <Stack.Screen name="TabStyle1" component={TabStyle1} />
      <Stack.Screen name="TabStyle2" component={TabStyle2} />
      <Stack.Screen name="TabStyle3" component={TabStyle3} />
      <Stack.Screen name="TabStyle4" component={TabStyle4} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

