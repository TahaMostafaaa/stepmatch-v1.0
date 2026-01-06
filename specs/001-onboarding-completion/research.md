# Research: Current Onboarding Implementation

**Date**: 2025-01-27  
**Purpose**: Document current onboarding screens and question text for comparison

## Current Onboarding Screens

### Screen Flow Order
1. FirstName
2. EnterBirthDate
3. YourGender
4. Orientation
5. Intrested (Interests)
6. LookingFor
7. RecentPics

## Current Question Text

### FirstName (`package/app/pages/info/FirstName.tsx`)
- **Question**: "Enter Your First name ?"
- **Placeholder**: "Enter your name"
- **Current State**: Basic input field, no validation, no progress indicator, no context-aware messaging
- **Navigation**: Goes to `EnterBirthDate` on Next

### EnterBirthDate (`package/app/pages/info/EnterBirthDate.tsx`)
- **Question**: "Enter Your Birth Date ?"
- **Placeholder**: "DD/MM/YYYY"
- **Current State**: Date picker, no age validation, no progress indicator, no context-aware messaging
- **Navigation**: Goes to `YourGender` on Next

### YourGender (`package/app/pages/info/YourGender.tsx`)
- **Question**: "What's your gender ?"
- **Options**: ["Women", "Men", "Other"]
- **Current State**: Single selection (defaults to "Men"), no validation feedback, no progress indicator
- **Navigation**: Goes to `Orientation` on Next

### Orientation (`package/app/pages/info/Orientation.tsx`)
- **Question**: "Your sexual orientation ?"
- **Options**: ["Straight", "Gay", "Lesbian", "Bisexual", "Asexual", "Queer", "Demisexual"]
- **Current State**: Multiple selection allowed (checkbox), no validation for single selection requirement, no progress indicator
- **Navigation**: Goes to `Intrested` on Next

### Intrested (`package/app/pages/info/Intrested.tsx`)
- **Question**: "Who are you interested in seeing ?"
- **Options**: ["Women", "Men", "Other"]
- **Current State**: Single selection (defaults to "Men"), no indication this is optional, no progress indicator
- **Navigation**: Goes to `LookingFor` on Next

### LookingFor (`package/app/pages/info/LookingFor.tsx`)
- **Question**: "What are you looking for right now ?"
- **Options**: ["Long-term partner", "Long-term, open to short", "Short-term, open to long", "Short-term fun", "New friends", "Stil figuring it out"]
- **Current State**: Single selection (defaults to "Long-term, open to short"), no indication this is optional, no progress indicator
- **Navigation**: Goes to `RecentPics` on Next

### RecentPics (`package/app/pages/info/RecentPics.tsx`)
- **Question**: "Add your recent pics"
- **Current State**: 
  - Allows up to 6 photos
  - Has upload functionality
  - Checks if photos already exist and redirects if they do
  - No validation for minimum 1 photo requirement (only shows alert)
  - No file size/format validation
  - No progress indicator
- **Navigation**: Goes to `DrawerNavigation` on Next (completes onboarding)

## Current Navigation Structure

### AuthNavigator (`package/app/Navigations/AuthNavigator.tsx`)
- Contains: OnBoarding, Login, SignUp
- **Issue**: Onboarding screens (FirstName, etc.) are NOT in AuthNavigator
- They are currently in AppNavigator (which requires authentication)

### AppNavigator (`package/app/Navigations/AppNavigator.tsx`)
- Contains onboarding screens: FirstName, EnterBirthDate, YourGender, Orientation, Intrested, LookingFor, RecentPics
- **Issue**: These screens are accessible after authentication, but there's no guard checking if onboarding is complete

### AuthGuard (`package/app/Navigations/AuthGuard.tsx`)
- Routes to AuthNavigator if not authenticated
- Routes to AppNavigator if authenticated
- **Issue**: No onboarding completion check

## Current Issues Identified

1. **No onboarding completion enforcement**: Users can access main app without completing onboarding
2. **No progress tracking**: No indication of which question user is on (e.g., "Question 3 of 7")
3. **No validation**: 
   - Name has no length validation
   - Birthdate has no age validation (18+)
   - Orientation allows multiple selections but should be single
   - Photos have no file size/format validation
4. **No context-aware messaging**: Same messaging for signup vs login flows
5. **No resume capability**: If app closes mid-onboarding, user starts from beginning
6. **No offline support**: Answers not saved locally before API sync
7. **No error handling**: No retry logic for failed API calls
8. **Optional questions not marked**: Intrested and LookingFor should be optional but aren't clearly marked

## Required vs Optional Questions (Per Spec)

### Required (must complete before app access):
- FirstName (2-50 characters)
- EnterBirthDate (18+ years old)
- YourGender (single selection)
- Orientation (single selection)
- RecentPics (at least 1 photo, max 10MB each, JPG/PNG)

### Optional (can skip):
- Intrested (interests)
- LookingFor (relationship preferences)

## Technical Patterns Observed

### Storage
- Uses AsyncStorage via `secureStorage.ts`
- Stores auth tokens and user data
- No onboarding progress storage currently

### API
- Uses `authApi.getProfile()` to fetch profile
- Uses `authApi.updateProfile()` to update profile
- Uses `uploadImages()` from `images.api.ts` for photo uploads

### Navigation
- Uses React Navigation 7.x
- Stack navigators for different flows
- Guard pattern exists (`LocationPermissionGuard`)

## Next Steps

1. Create `OnboardingCompletionGuard` similar to `LocationPermissionGuard`
2. Create `OnboardingService` for validation and progress tracking
3. Create `OnboardingContext` for state management
4. Update all onboarding screens with validation, progress indicators, and context-aware messaging
5. Add local storage for offline support
6. Add retry logic for API failures


