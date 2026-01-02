# Implementation Plan: Onboarding Completion & Flow Improvements

**Branch**: `001-onboarding-completion` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-onboarding-completion/spec.md`

## Summary

This feature improves the onboarding experience by ensuring all required profile questions are completed before users access the main app. Key improvements include: (1) enforcing onboarding completion after signup, (2) prompting returning users with incomplete profiles to complete missing questions after login, (3) improving question clarity and differentiating messaging between signup and login flows, (4) adding validation, error handling, and offline support.

**Technical Approach**: Create an `OnboardingCompletionGuard` component (similar to `LocationPermissionGuard`) that checks profile completeness and routes users to onboarding screens when required fields are missing. Implement an onboarding service/context to track progress, manage local storage for offline support, and handle API retries with exponential backoff.

## Technical Context

**Language/Version**: TypeScript ~5.9.2  
**Primary Dependencies**: React Native 0.81.5, Expo ~54.0.23, React Navigation 7.x, React Native Paper 5.14.5, AsyncStorage 2.2.0  
**Storage**: AsyncStorage (local), Backend API (remote), SecureStorage utilities  
**Testing**: Manual testing, React Native testing utilities (Jest recommended for future)  
**Target Platform**: iOS, Android, Web (React Native Expo)  
**Project Type**: Mobile application (React Native Expo)  
**Performance Goals**: Onboarding completion check within 2 seconds (SC-007), smooth navigation transitions  
**Constraints**: Must work offline (queue submissions), handle API failures gracefully, maintain existing navigation structure  
**Scale/Scope**: All authenticated users, ~7 onboarding screens, profile completion tracking

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution violations detected. This feature:
- Uses existing navigation patterns (guard-based routing)
- Leverages existing storage utilities (AsyncStorage, secureStorage)
- Extends existing API patterns (authApi)
- Maintains single codebase structure
- No new external dependencies required beyond existing stack

## Project Structure

### Documentation (this feature)

```text
specs/001-onboarding-completion/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
package/app/
├── Navigations/
│   ├── OnboardingCompletionGuard.tsx    # NEW: Guard to check completion and route
│   ├── AuthGuard.tsx                     # MODIFY: Add onboarding check after auth
│   ├── AppNavigator.tsx                   # MODIFY: Wrap with OnboardingCompletionGuard
│   └── AuthNavigator.tsx                 # MODIFY: Add onboarding screens to auth stack
│
├── services/
│   └── onboardingService.ts             # NEW: Service for tracking progress, validation, retry logic
│
├── context/
│   └── onboardingContext.tsx             # NEW: Context for onboarding state management
│
├── pages/
│   ├── Auth/
│   │   ├── Login.tsx                      # MODIFY: Navigate to onboarding if incomplete after login
│   │   └── SignUp.tsx                     # MODIFY: Navigate to onboarding after signup
│   │
│   └── info/                              # MODIFY: Improve question text, add validation, save progress
│       ├── FirstName.tsx                  # MODIFY: Add validation, progress tracking, context-aware messaging
│       ├── EnterBirthDate.tsx             # MODIFY: Add validation (18+), progress tracking
│       ├── YourGender.tsx                 # MODIFY: Add validation, progress tracking
│       ├── Orientation.tsx                # MODIFY: Add validation (single selection), progress tracking
│       ├── Intrested.tsx                  # MODIFY: Mark as optional, improve text, progress tracking
│       ├── LookingFor.tsx                 # MODIFY: Mark as optional, improve text, progress tracking
│       └── RecentPics.tsx                  # MODIFY: Add validation (10MB, JPG/PNG), progress tracking
│
├── storage/
│   └── secureStorage.ts                   # MODIFY: Add onboarding progress storage functions
│
└── api/
    └── auth.api.ts                        # MODIFY: Add retry logic wrapper, error handling
```

**Structure Decision**: Single React Native Expo project structure. New components follow existing patterns:
- Guards in `Navigations/` (like `LocationPermissionGuard`)
- Services in `services/` (like `locationService.ts`)
- Contexts in `context/` (like `matchingContext.tsx`)
- Screens remain in `pages/` with existing organization

## Architecture Overview

### Component Hierarchy

```
App.tsx
└── AuthProvider
    └── AuthGuard
        ├── AuthNavigator (if not authenticated)
        │   ├── OnBoarding
        │   ├── Login
        │   └── SignUp
        │
        └── OnboardingCompletionGuard (if authenticated)
            ├── OnboardingNavigator (if incomplete)
            │   └── [Onboarding screens]
            │
            └── AppNavigator (if complete)
                └── DrawerNavigation
```

### Key Components

1. **OnboardingCompletionGuard**: 
   - Checks profile completeness via API or cached data
   - Routes to onboarding flow if required fields missing
   - Routes to main app if complete
   - Handles loading state during check

2. **OnboardingService**:
   - Tracks which questions are answered/missing
   - Validates answers (name length, age, photo format/size)
   - Manages local storage for offline support
   - Queues failed API submissions for retry
   - Implements exponential backoff retry logic

3. **OnboardingContext**:
   - Provides onboarding state to screens
   - Manages progress tracking
   - Handles answer persistence
   - Differentiates signup vs login flow context

4. **Updated Onboarding Screens**:
   - Improved question text (clearer, more engaging)
   - Context-aware messaging (signup: "Welcome! Let's set up your profile" vs login: "Complete your profile")
   - Progress indicators ("Question 3 of 7")
   - Validation feedback
   - Save progress on each answer
   - Handle API errors with retry

## Data Model

### Onboarding Progress (Local Storage)

```typescript
interface OnboardingProgress {
  userId: string;
  answeredQuestions: {
    firstName?: string;
    birthdate?: string; // YYYY-MM-DD
    gender?: string;
    orientation?: string[];
    interests?: string[];
    lookingFor?: string;
    photos?: string[]; // URLs or local paths
  };
  lastAnsweredQuestion: string; // Question ID for resume
  completedAt?: string; // ISO timestamp
  flowType: 'signup' | 'login'; // Context for messaging
}
```

### Required vs Optional Questions

**Required** (block app access):
- `firstName` (2-50 characters)
- `birthdate` (18+ years old)
- `gender` (single selection)
- `orientation` (single selection)
- `photos` (at least 1, max 10MB each, JPG/PNG)

**Optional** (can skip):
- `interests` (array)
- `lookingFor` (string)

### Profile Completeness Check

The system checks for missing required fields:
```typescript
function isOnboardingComplete(profile: Profile): boolean {
  return !!(
    profile.name &&
    profile.birthdate &&
    profile.gender && // Assuming API returns this
    profile.orientation && // Assuming API returns this
    profile.images && profile.images.length > 0
  );
}
```

## Implementation Phases

### Phase 0: Research & Setup
- [x] Review existing navigation structure
- [x] Review existing onboarding screens
- [x] Review API structure and profile data
- [x] Identify required vs optional questions
- [ ] Document current question text for comparison

### Phase 1: Core Infrastructure
1. **Create OnboardingService** (`services/onboardingService.ts`)
   - Question definitions (required/optional, validation rules)
   - Progress tracking functions
   - Validation functions (name, age, photo format/size)
   - Local storage helpers
   - Retry queue management

2. **Create OnboardingContext** (`context/onboardingContext.tsx`)
   - State management for onboarding flow
   - Progress tracking
   - Answer persistence
   - Flow type (signup/login) tracking

3. **Create OnboardingCompletionGuard** (`Navigations/OnboardingCompletionGuard.tsx`)
   - Profile completeness check
   - Routing logic
   - Loading state handling

### Phase 2: Navigation Integration
1. **Update AuthGuard** (`Navigations/AuthGuard.tsx`)
   - Add onboarding check after authentication
   - Route to OnboardingCompletionGuard when authenticated

2. **Update AppNavigator** (`Navigations/AppNavigator.tsx`)
   - Wrap with OnboardingCompletionGuard
   - Ensure onboarding screens accessible

3. **Update AuthNavigator** (`Navigations/AuthNavigator.tsx`)
   - Add onboarding screens to auth stack (for signup flow)

4. **Create OnboardingNavigator** (`Navigations/OnboardingNavigator.tsx`)
   - Stack navigator for onboarding screens
   - Progress-aware navigation

### Phase 3: Screen Updates
1. **Update Login.tsx** (`pages/Auth/Login.tsx`)
   - After successful login, check onboarding completion
   - Navigate to onboarding if incomplete

2. **Update SignUp.tsx** (`pages/Auth/SignUp.tsx`)
   - After successful signup, navigate to onboarding
   - Set flow type to 'signup'

3. **Update all onboarding screens** (`pages/info/*.tsx`)
   - Improve question text
   - Add context-aware messaging (signup vs login)
   - Add progress indicators
   - Add validation
   - Integrate with OnboardingContext
   - Save progress on answer
   - Handle API errors with retry

### Phase 4: Error Handling & Offline Support
1. **Update secureStorage.ts** (`storage/secureStorage.ts`)
   - Add onboarding progress storage functions
   - Add retry queue storage

2. **Update auth.api.ts** (`api/auth.api.ts`)
   - Add retry wrapper with exponential backoff
   - Improve error messages

3. **Implement retry queue** (`services/onboardingService.ts`)
   - Queue failed submissions
   - Automatic retry on connectivity restore
   - Exponential backoff logic

### Phase 5: Testing & Refinement
1. Test signup flow → onboarding completion
2. Test login with incomplete profile → onboarding prompt
3. Test login with complete profile → direct to app
4. Test offline scenario → local save, sync on reconnect
5. Test API failure → retry logic
6. Test app closure mid-onboarding → resume capability
7. Validate all required questions block access
8. Validate optional questions can be skipped

## Technical Decisions

### 1. Guard Pattern
**Decision**: Use guard component pattern (like `LocationPermissionGuard`)  
**Rationale**: Consistent with existing codebase, clean separation of concerns, reusable routing logic

### 2. Context for State Management
**Decision**: Create `OnboardingContext` for onboarding state  
**Rationale**: Multiple screens need shared state, follows React patterns, easier to test

### 3. Service Layer for Business Logic
**Decision**: Create `onboardingService.ts` for validation, progress tracking, retry logic  
**Rationale**: Separates business logic from UI, testable, reusable

### 4. Local Storage First
**Decision**: Save answers locally immediately, sync to API in background  
**Rationale**: Better UX (no waiting), offline support, can resume if app closes

### 5. Exponential Backoff Retry
**Decision**: Implement exponential backoff for API retries (1s, 2s, 4s, 8s, max 30s)  
**Rationale**: Prevents server overload, standard practice, improves reliability

### 6. Validation Rules
**Decision**: Client-side validation with server-side validation as backup  
**Rationale**: Immediate feedback, better UX, reduces unnecessary API calls

## Dependencies & Integration Points

### Existing Components Used
- `AuthGuard`: Routes based on authentication
- `LocationPermissionGuard`: Pattern for guard implementation
- `secureStorage`: Storage utilities
- `authApi`: Profile fetching and updates
- `AuthContext`: Authentication state

### New Dependencies Required
- None (all functionality achievable with existing stack)

### API Endpoints Used
- `GET /auth/profile`: Check profile completeness
- `PUT /auth/profile`: Update profile with onboarding answers
- `POST /api/images`: Upload photos (assumed endpoint)

### Storage Keys Added
- `onboarding_progress_{userId}`: Onboarding progress data
- `onboarding_retry_queue_{userId}`: Failed submission queue

## Risk Mitigation

### Risk 1: Performance Impact of Completeness Check
**Mitigation**: Cache profile data, check only on auth state change, use loading states

### Risk 2: Offline/Online Sync Conflicts
**Mitigation**: Timestamp-based conflict resolution, last-write-wins for simple fields

### Risk 3: API Rate Limiting from Retries
**Mitigation**: Exponential backoff, max retry attempts (5), user notification after max retries

### Risk 4: Navigation Stack Complexity
**Mitigation**: Clear guard hierarchy, test navigation flows thoroughly, use React Navigation reset when needed

## Success Metrics

- Onboarding completion check completes in <2 seconds (SC-007)
- 95% of new users complete required onboarding (SC-001)
- 90% of returning users complete missing questions (SC-003)
- 99% data persistence success rate (SC-008)
- <5% abandonment during onboarding (SC-006)

## Next Steps

1. Review and approve this plan
2. Run `/speckit.tasks` to generate detailed task breakdown
3. Begin Phase 1 implementation (Core Infrastructure)
4. Iterate through phases with testing at each stage

