# Tasks: Onboarding Completion & Flow Improvements

**Input**: Design documents from `/specs/001-onboarding-completion/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure review

- [x] T001 Review existing onboarding screens and document current question text in `specs/001-onboarding-completion/research.md`
- [x] T002 [P] Review existing navigation structure (`package/app/Navigations/`) and document patterns
- [x] T003 [P] Review existing storage utilities (`package/app/storage/secureStorage.ts`) and API patterns (`package/app/api/auth.api.ts`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `package/app/services/onboardingService.ts` with question definitions, validation functions, and progress tracking utilities
- [x] T005 [P] Create `package/app/context/onboardingContext.tsx` with state management for onboarding flow, progress tracking, and answer persistence
- [x] T006 [P] Create `package/app/Navigations/OnboardingCompletionGuard.tsx` with profile completeness check and routing logic
- [x] T007 [P] Create `package/app/Navigations/OnboardingNavigator.tsx` as stack navigator for onboarding screens
- [x] T008 Extend `package/app/storage/secureStorage.ts` with onboarding progress storage functions (`saveOnboardingProgress`, `getOnboardingProgress`, `clearOnboardingProgress`)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - New User Completes Full Onboarding After Signup (Priority: P1) 🎯 MVP

**Goal**: New users complete all required onboarding questions immediately after signup before accessing the main app

**Independent Test**: Create a new account, complete signup, verify all onboarding screens appear in sequence, complete all required questions, verify access to main app is granted

### Implementation for User Story 1

- [x] T009 [US1] Update `package/app/pages/Auth/SignUp.tsx` to navigate to onboarding flow after successful signup and set flow type to 'signup' in OnboardingContext
- [x] T010 [US1] Update `package/app/Navigations/AuthNavigator.tsx` to include onboarding screens in auth stack (FirstName, EnterBirthDate, YourGender, Orientation, Intrested, LookingFor, RecentPics)
- [x] T011 [US1] Update `package/app/Navigations/AuthGuard.tsx` to route authenticated users to OnboardingCompletionGuard instead of directly to AppNavigator
- [x] T012 [US1] Update `package/app/Navigations/OnboardingCompletionGuard.tsx` to check profile completeness after signup and route to OnboardingNavigator if incomplete
- [x] T013 [US1] Update `package/app/pages/info/FirstName.tsx` to integrate with OnboardingContext, add validation (2-50 characters), show progress indicator, save progress on answer, and use signup flow messaging ("Welcome! Let's set up your profile")
- [ ] T014 [US1] Update `package/app/pages/info/EnterBirthDate.tsx` to integrate with OnboardingContext, add validation (18+ years old), show progress indicator, save progress on answer, and use signup flow messaging
- [ ] T015 [US1] Update `package/app/pages/info/YourGender.tsx` to integrate with OnboardingContext, add validation (single selection required), show progress indicator, save progress on answer, and use signup flow messaging
- [ ] T016 [US1] Update `package/app/pages/info/Orientation.tsx` to integrate with OnboardingContext, add validation (single selection required), show progress indicator, save progress on answer, and use signup flow messaging
- [ ] T017 [US1] Update `package/app/pages/info/RecentPics.tsx` to integrate with OnboardingContext, add validation (at least 1 photo, max 10MB each, JPG/PNG format), show progress indicator, save progress on answer, and use signup flow messaging
- [ ] T018 [US1] Update `package/app/services/onboardingService.ts` to implement `isOnboardingComplete()` function that checks all required fields (name, birthdate, gender, orientation, at least one photo)
- [ ] T019 [US1] Update `package/app/Navigations/OnboardingNavigator.tsx` to navigate to AppNavigator when onboarding is complete (all required questions answered)

**Checkpoint**: At this point, User Story 1 should be fully functional - new users complete onboarding after signup before accessing main app

---

## Phase 4: User Story 2 - Returning User Completes Missing Onboarding After Login (Priority: P1)

**Goal**: Returning users with incomplete profiles are prompted to complete missing onboarding questions after login before accessing the main app

**Independent Test**: Login with an account that has incomplete onboarding data, verify missing questions are presented, complete missing questions, verify access to main app is granted. Login with complete profile, verify immediate access to main app without onboarding screens.

### Implementation for User Story 2

- [ ] T020 [US2] Update `package/app/pages/Auth/Login.tsx` to check onboarding completion after successful login and navigate to onboarding if incomplete, set flow type to 'login' in OnboardingContext
- [ ] T021 [US2] Update `package/app/Navigations/OnboardingCompletionGuard.tsx` to check profile completeness after login (fetch profile via API or use cached data), route to OnboardingNavigator if incomplete, route to AppNavigator if complete
- [ ] T022 [US2] Update `package/app/services/onboardingService.ts` to implement `getMissingRequiredQuestions()` function that identifies which required questions are unanswered based on profile data
- [ ] T023 [US2] Update `package/app/Navigations/OnboardingNavigator.tsx` to show only missing required questions (skip already answered questions), use login flow messaging ("Complete your profile")
- [ ] T024 [US2] Update `package/app/pages/info/FirstName.tsx` to check if question already answered and skip if complete, show login flow messaging when flowType is 'login'
- [ ] T025 [US2] Update `package/app/pages/info/EnterBirthDate.tsx` to check if question already answered and skip if complete, show login flow messaging when flowType is 'login'
- [ ] T026 [US2] Update `package/app/pages/info/YourGender.tsx` to check if question already answered and skip if complete, show login flow messaging when flowType is 'login'
- [ ] T027 [US2] Update `package/app/pages/info/Orientation.tsx` to check if question already answered and skip if complete, show login flow messaging when flowType is 'login'
- [ ] T028 [US2] Update `package/app/pages/info/RecentPics.tsx` to check if question already answered (at least one photo exists) and skip if complete, show login flow messaging when flowType is 'login'
- [ ] T029 [US2] Update `package/app/context/onboardingContext.tsx` to load existing profile data and identify missing questions on initialization
- [ ] T030 [US2] Update `package/app/Navigations/OnboardingCompletionGuard.tsx` to handle loading state during profile completeness check (show loading indicator, complete check within 2 seconds per SC-007)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - new users complete onboarding after signup, returning users complete missing questions after login

---

## Phase 5: User Story 3 - Onboarding Questions Are Improved and Differentiated (Priority: P2)

**Goal**: Onboarding questions are enhanced for clarity and relevance, with different messaging for signup (welcome/setup) vs login completion (profile completion) flows

**Independent Test**: Compare onboarding experience during signup vs login completion, verify questions are clear and relevant, verify appropriate contextual messaging, verify progress indicators show correctly

### Implementation for User Story 3

- [ ] T031 [US3] Update `package/app/pages/info/FirstName.tsx` to improve question text ("What's your first name?" → clearer, more engaging version), add progress indicator showing "Question 1 of 7" or similar
- [ ] T032 [US3] Update `package/app/pages/info/EnterBirthDate.tsx` to improve question text, add progress indicator, add helpful hint text about age requirement
- [ ] T033 [US3] Update `package/app/pages/info/YourGender.tsx` to improve question text, add progress indicator, improve option labels if needed
- [ ] T034 [US3] Update `package/app/pages/info/Orientation.tsx` to improve question text, add progress indicator, clarify that single selection is required
- [ ] T035 [US3] Update `package/app/pages/info/Intrested.tsx` to mark as optional question (can be skipped), improve question text, add progress indicator, add "Skip" button option
- [ ] T036 [US3] Update `package/app/pages/info/LookingFor.tsx` to mark as optional question (can be skipped), improve question text, add progress indicator, add "Skip" button option
- [ ] T037 [US3] Update `package/app/services/onboardingService.ts` to implement `getTotalQuestionCount()` and `getCurrentQuestionIndex()` functions for progress calculation
- [ ] T038 [US3] Update `package/app/context/onboardingContext.tsx` to provide progress calculation utilities (current question number, total questions, percentage complete)
- [ ] T039 [US3] Create reusable `ProgressIndicator` component in `package/app/components/Onboarding/ProgressIndicator.tsx` to show "Question X of Y" consistently across screens
- [ ] T040 [US3] Update all onboarding screens to use context-aware messaging: signup flow shows "Welcome! Let's set up your profile" style messages, login flow shows "Complete your profile" style messages

**Checkpoint**: At this point, all user stories should be independently functional - questions are improved, differentiated by flow type, and show progress indicators

---

## Phase 6: Error Handling & Offline Support

**Purpose**: Handle API failures gracefully, support offline usage, implement retry logic

- [ ] T041 Update `package/app/api/auth.api.ts` to add retry wrapper function with exponential backoff (1s, 2s, 4s, 8s, max 30s) for profile update requests
- [ ] T042 Update `package/app/services/onboardingService.ts` to implement retry queue management: queue failed submissions, store in AsyncStorage, retry automatically when connectivity restored
- [ ] T043 Update `package/app/storage/secureStorage.ts` to add retry queue storage functions (`saveRetryQueue`, `getRetryQueue`, `clearRetryQueue`)
- [ ] T044 Update all onboarding screens (`package/app/pages/info/*.tsx`) to handle API errors gracefully: show user-friendly error messages, allow retry with exponential backoff, queue failed submissions
- [ ] T045 Update `package/app/services/onboardingService.ts` to implement `saveAnswerLocally()` function that saves answers to AsyncStorage immediately (before API call) for offline support
- [ ] T046 Update `package/app/services/onboardingService.ts` to implement `syncAnswersToAPI()` function that syncs locally saved answers to API when connectivity available
- [ ] T047 Update `package/app/context/onboardingContext.tsx` to detect connectivity changes and trigger automatic sync of queued submissions
- [ ] T048 Update `package/app/pages/info/RecentPics.tsx` to handle photo upload failures: show error message, allow retry, queue failed uploads for retry

---

## Phase 7: Resume Capability & Data Persistence

**Purpose**: Allow users to resume onboarding if app closes mid-flow, ensure data persistence

- [ ] T049 Update `package/app/services/onboardingService.ts` to implement `getLastAnsweredQuestion()` function that returns the last question ID answered for resume capability
- [ ] T050 Update `package/app/Navigations/OnboardingNavigator.tsx` to check for last answered question on initialization and navigate to that question if onboarding incomplete
- [ ] T051 Update `package/app/context/onboardingContext.tsx` to save `lastAnsweredQuestion` to local storage on each answer submission
- [ ] T052 Update `package/app/storage/secureStorage.ts` to add `onboarding_progress_{userId}` storage key for persisting progress data
- [ ] T053 Update all onboarding screens to save progress immediately on answer (before navigation to next screen) to ensure data persistence even if app closes
- [ ] T054 Test data persistence: close app mid-onboarding, reopen app, verify resume from last answered question

---

## Phase 8: Validation & User Feedback

**Purpose**: Add comprehensive validation with user-friendly feedback

- [ ] T055 Update `package/app/services/onboardingService.ts` to implement `validateName()` function (2-50 characters, show specific error messages)
- [ ] T056 Update `package/app/services/onboardingService.ts` to implement `validateBirthdate()` function (18+ years old, calculate age, show specific error messages)
- [ ] T057 Update `package/app/services/onboardingService.ts` to implement `validatePhoto()` function (check file size max 10MB, check format JPG/PNG, show specific error messages)
- [ ] T058 Update `package/app/pages/info/FirstName.tsx` to show validation errors inline, prevent navigation if validation fails
- [ ] T059 Update `package/app/pages/info/EnterBirthDate.tsx` to show validation errors inline (age requirement), prevent navigation if validation fails
- [ ] T060 Update `package/app/pages/info/RecentPics.tsx` to show validation errors inline (file size, format), prevent navigation if validation fails (at least one photo required)
- [ ] T061 Update `package/app/pages/info/YourGender.tsx` to show validation error if no selection made, prevent navigation if validation fails
- [ ] T062 Update `package/app/pages/info/Orientation.tsx` to show validation error if no selection made or multiple selections, prevent navigation if validation fails

---

## Phase 9: Testing & Refinement

**Purpose**: Comprehensive testing of all flows and edge cases

- [ ] T063 Test signup flow: create new account → verify onboarding screens appear → complete all required questions → verify access to main app
- [ ] T064 Test login with incomplete profile: login with account missing required fields → verify onboarding screens appear → complete missing questions → verify access to main app
- [ ] T065 Test login with complete profile: login with complete profile → verify immediate access to main app without onboarding screens
- [ ] T066 Test offline scenario: start onboarding → disconnect network → answer questions → verify local save → reconnect → verify automatic sync
- [ ] T067 Test API failure: simulate API failure during answer submission → verify error message → verify retry functionality → verify queue for automatic retry
- [ ] T068 Test app closure mid-onboarding: answer some questions → close app → reopen app → verify resume from last answered question
- [ ] T069 Test validation: attempt to submit invalid data (name too short, age under 18, invalid photo format) → verify validation errors → verify navigation blocked
- [ ] T070 Test optional questions: skip interests and lookingFor questions → verify can proceed → verify access to main app granted
- [ ] T071 Test progress indicators: verify "Question X of Y" shows correctly on each screen, verify progress updates correctly
- [ ] T072 Test flow differentiation: verify signup flow shows "Welcome! Let's set up your profile" messaging, verify login flow shows "Complete your profile" messaging
- [ ] T073 Performance test: verify onboarding completion check completes within 2 seconds (SC-007)
- [ ] T074 Test backward navigation: verify users can navigate backward through onboarding questions to review or change previous answers

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and cleanup

- [ ] T075 [P] Update `package/app/Navigations/AppNavigator.tsx` to ensure onboarding screens remain accessible (for optional question completion later)
- [ ] T076 [P] Code cleanup: remove unused imports, fix TypeScript errors, ensure consistent code style
- [ ] T077 [P] Add error logging for onboarding failures (API errors, validation errors, sync failures)
- [ ] T078 [P] Update navigation type definitions (`package/app/Navigations/AppStackParamList.tsx`, `package/app/Navigations/AuthStackParamList.tsx`) to include onboarding screens
- [ ] T079 [P] Document onboarding flow in code comments, add JSDoc comments to new functions
- [ ] T080 [P] Verify all success criteria met: SC-001 (95% completion), SC-002 (<5 minutes), SC-003 (90% returning users), SC-004 (85% clarity), SC-007 (<2 seconds), SC-008 (99% persistence)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (Phase 3) can start after Foundational
  - User Story 2 (Phase 4) can start after Foundational (may use US1 components but independently testable)
  - User Story 3 (Phase 5) can start after Foundational (enhances US1/US2 screens)
- **Error Handling (Phase 6)**: Depends on User Stories 1-2 completion
- **Resume Capability (Phase 7)**: Depends on User Stories 1-2 completion
- **Validation (Phase 8)**: Depends on User Stories 1-2 completion
- **Testing (Phase 9)**: Depends on all previous phases
- **Polish (Phase 10)**: Depends on all desired phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses same infrastructure as US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Enhances US1/US2 screens but independently testable

### Within Each User Story

- Core infrastructure (service, context, guard) before screen updates
- Screen updates can be done in parallel (different files)
- Integration tasks after individual screen updates
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1-3 can start in parallel (if team capacity allows)
- Screen updates within a story marked [P] can run in parallel (different files)
- Different user stories can be worked on in parallel by different team members
- Polish tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Error Handling & Offline Support → Test → Deploy/Demo
6. Add Resume Capability → Test → Deploy/Demo
7. Add Validation → Test → Deploy/Demo
8. Each phase adds value without breaking previous phases

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (signup flow)
   - Developer B: User Story 2 (login flow)
   - Developer C: User Story 3 (question improvements)
3. Stories complete and integrate independently
4. Team works on Error Handling, Resume, Validation in parallel
5. Final testing and polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Required questions block app access; optional questions can be skipped
- Progress tracking must work across all screens
- Offline support is critical for mobile app reliability
- Retry logic prevents data loss from transient failures

