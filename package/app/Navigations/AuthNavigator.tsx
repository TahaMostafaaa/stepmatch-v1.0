/**
 * Auth Navigator
 * 
 * Navigation stack for unauthenticated users.
 * Contains: Splash, OnBoarding, Login, SignUp screens.
 * 
 * This navigator is shown when the user is NOT authenticated.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth screens
import Splash from '../pages/Splash/Splash';
import OnBoarding from '../pages/Splash/OnBoarding';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';

// Type for auth stack routes
export type AuthStackParamList = {
  Splash: undefined;
  OnBoarding: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnBoarding"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

