# Tasks: Fix Profile Image Upload During Onboarding

**Input**: Design documents from `/specs/002-fix-profile-image-upload/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile app**: `package/app/` at repository root
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type definitions

- [X] T001 [P] Add GetImagesResponse interface to package/app/api/images.api.ts
- [X] T002 [P] Add UploadImagesResponse interface validation types to package/app/api/images.api.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API functions that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Implement getUserImages() function in package/app/api/images.api.ts
- [X] T004 Enhance uploadImages() function with response validation in package/app/api/images.api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Completes Profile Photo Upload During Onboarding (Priority: P1) 🎯 MVP

**Goal**: User can complete onboarding by uploading at least 1 photo (up to 6 maximum) after system checks for existing photos

**Independent Test**: Complete onboarding up to photo upload step, select photos, upload them, verify they are saved and user can proceed to main app

### Implementation for User Story 1

- [X] T005 [US1] Replace authApi.getProfile() check with getUserImages() API call in package/app/pages/info/RecentPics.tsx
- [X] T006 [US1] Update photo check logic to treat GET /images/ failures as "no photos exist" in package/app/pages/info/RecentPics.tsx
- [X] T007 [US1] Add minimum photo validation (require at least 1 photo) before allowing proceed in package/app/pages/info/RecentPics.tsx
- [X] T008 [US1] Update handleContinue() function to validate minimum 1 photo uploaded in package/app/pages/info/RecentPics.tsx
- [X] T009 [US1] Update handleUploadImages() to use enhanced uploadImages() with response validation in package/app/pages/info/RecentPics.tsx
- [X] T010 [US1] Update UI to display existing photos from GET /images/ response in package/app/pages/info/RecentPics.tsx
- [X] T011 [US1] Update imageData state management to handle uploaded image URLs from API response in package/app/pages/info/RecentPics.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can check for existing photos, upload new photos, and proceed to main app

---

## Phase 4: User Story 2 - System Handles Photo Upload Errors Gracefully (Priority: P2)

**Goal**: System displays clear error messages and allows retry when upload fails due to network issues, file size limits, or API errors

**Independent Test**: Simulate upload failures (network errors, oversized files, API errors) and verify appropriate error messages are shown with retry options

### Implementation for User Story 2

- [X] T012 [US2] Add client-side file size validation (max 5MB) before upload in package/app/pages/info/RecentPics.tsx
- [X] T013 [US2] Add client-side file type validation (JPEG, JPG, PNG, WEBP) before upload in package/app/pages/info/RecentPics.tsx
- [X] T014 [US2] Add photo count validation (max 6 photos) before allowing additional selections in package/app/pages/info/RecentPics.tsx
- [X] T015 [US2] Enhance error handling in handleUploadImages() to display user-friendly error messages in package/app/pages/info/RecentPics.tsx
- [X] T016 [US2] Add retry functionality for failed uploads without losing selected photos in package/app/pages/info/RecentPics.tsx
- [X] T017 [US2] Handle empty image_urls response from upload API (treat as failure) in package/app/pages/info/RecentPics.tsx
- [X] T018 [US2] Handle partial upload success scenarios (some photos succeed, others fail) in package/app/pages/info/RecentPics.tsx
- [X] T019 [US2] Add upload progress/loading state display during photo upload operations in package/app/pages/info/RecentPics.tsx
- [X] T020 [US2] Implement background upload support using AppState API in package/app/pages/info/RecentPics.tsx
- [X] T021 [US2] Add notification when upload completes in background in package/app/pages/info/RecentPics.tsx
- [X] T022 [US2] Allow retry of failed uploads when user returns to screen after navigating away in package/app/pages/info/RecentPics.tsx
- [X] T023 [US2] Enhance apiClient response interceptor for automatic token refresh and retry on 401 errors in package/app/api/apiClient.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently with full error handling

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T024 [P] Update TypeScript types documentation in package/app/api/images.api.ts
- [X] T025 [P] Add error logging for API failures in package/app/pages/info/RecentPics.tsx
- [X] T026 Code cleanup and refactoring in package/app/pages/info/RecentPics.tsx
- [X] T027 Verify all error messages are user-friendly and actionable
- [ ] T028 Run quickstart.md validation checklist
- [ ] T029 Test on both iOS and Android platforms
- [ ] T030 Verify token refresh flow works correctly during upload

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start after Foundational
  - User Story 2 (P2) can start after Foundational (can work in parallel with US1 after T003-T004 complete)
- **Polish (Phase 5)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable

### Within Each User Story

- API functions before component integration
- Validation before upload logic
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1 tasks (T001, T002) can run in parallel
- Phase 2 tasks (T003, T004) can run in parallel after Phase 1
- User Story 1 tasks (T005-T011) must run sequentially (same file)
- User Story 2 tasks (T012-T023) must run sequentially (same file, but T023 can run in parallel)
- Phase 5 tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Phase 1: Can run in parallel
Task T001: "Add GetImagesResponse interface to package/app/api/images.api.ts"
Task T002: "Add UploadImagesResponse interface validation types to package/app/api/images.api.ts"

# Phase 2: Can run in parallel after Phase 1
Task T003: "Implement getUserImages() function in package/app/api/images.api.ts"
Task T004: "Enhance uploadImages() function with response validation in package/app/api/images.api.ts"

# User Story 1: Sequential (same file modifications)
Task T005 → T006 → T007 → T008 → T009 → T010 → T011
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T005-T011)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Verify GET /images/ API integration works
   - Verify photo upload works
   - Verify minimum 1 photo requirement enforced
   - Verify user can proceed to main app
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T005-T011)
   - Developer B: User Story 2 (T012-T022) + Token refresh (T023)
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 30
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 2 tasks
- Phase 3 (User Story 1): 7 tasks
- Phase 4 (User Story 2): 12 tasks
- Phase 5 (Polish): 7 tasks

**Parallel Opportunities**: 
- Phase 1: 2 parallel tasks
- Phase 2: 2 parallel tasks
- Phase 5: 2 parallel tasks
- User Story 2: T023 can run in parallel with T012-T022

**Independent Test Criteria**:
- **User Story 1**: Complete onboarding, select photos, upload successfully, proceed to main app
- **User Story 2**: Simulate failures, verify error messages, verify retry works

**Suggested MVP Scope**: User Story 1 only (Phases 1-3) = 11 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to repository root
- Verify error handling works for all scenarios
- Test on both iOS and Android before completing

