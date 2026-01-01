# Implementation Plan: Fix Profile Image Upload During Onboarding

**Branch**: `002-fix-profile-image-upload` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fix-profile-image-upload/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix the profile image upload flow during onboarding by implementing proper API integration for checking existing photos (GET /images/) and uploading new photos (POST /images/upload). The fix ensures users can complete onboarding by uploading at least 1 photo (up to 6 maximum), with proper error handling, token refresh, and background upload support.

**Technical Approach**: 
- Add `getUserImages()` function to `images.api.ts` for GET /images/ endpoint
- Enhance `uploadImages()` function with response validation
- Update `RecentPics.tsx` component to use GET /images/ API instead of profile check
- Add minimum photo validation (require at least 1 photo)
- Implement background upload support using React Native AppState API
- Enhance error handling for all failure scenarios

## Technical Context

**Language/Version**: TypeScript ~5.9.2, React Native 0.81.5  
**Primary Dependencies**: Expo ~54.0.23, React Navigation 7.x, axios ^1.6.0, expo-image-picker ^17.0.8, React Native Paper 5.14.5  
**Storage**: AsyncStorage for local state, Supabase Storage for image storage (backend)  
**Testing**: Jest (React Native testing), manual testing on iOS/Android  
**Target Platform**: iOS and Android mobile apps  
**Project Type**: Mobile application (React Native Expo)  
**Performance Goals**: Photo check API response within 2 seconds, upload completion within 1 minute, 60fps UI animations  
**Constraints**: Max 6 photos per user, 5MB per file, supported formats: JPEG/JPG/PNG/WEBP, must work offline-capable (queue uploads)  
**Scale/Scope**: Single feature fix affecting onboarding flow, ~1 screen component, 2 API endpoints integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Mobile-First Development ✅
- **Status**: PASS
- **Compliance**: Feature uses React Native components, expo-image-picker for mobile photo selection, follows mobile UX patterns
- **Notes**: Uses existing mobile-first architecture, no desktop considerations needed

### User Privacy & Security ✅
- **Status**: PASS
- **Compliance**: Uses Bearer token authentication via apiClient, secure token storage, HTTPS API calls
- **Notes**: Token refresh mechanism already implemented in apiClient, follows security standards

### API Integration & Data Handling ✅
- **Status**: PASS
- **Compliance**: Uses centralized apiClient, proper error handling, multipart/form-data for uploads
- **Notes**: Follows existing API patterns, integrates with existing error handling infrastructure

### User Experience Excellence ✅
- **Status**: PASS
- **Compliance**: Loading states, error messages, progress indicators, background upload support
- **Notes**: Implements user-friendly error handling, retry mechanisms, notification support

### Testing & Quality Assurance ⚠️
- **Status**: PARTIAL
- **Compliance**: Manual testing required, integration tests recommended
- **Notes**: Should add integration tests for API calls and error scenarios (deferred to implementation)

### Code Organization & Maintainability ✅
- **Status**: PASS
- **Compliance**: Follows existing structure (api/, pages/, services/), TypeScript types defined
- **Notes**: Extends existing images.api.ts, modifies existing RecentPics.tsx component

**Overall Status**: ✅ PASS - All critical gates pass, testing can be added during implementation

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
package/
└── app/
    ├── api/
    │   ├── apiClient.ts                    # MODIFY: Add token refresh retry logic for 401 errors
    │   └── images.api.ts                   # MODIFY: Add getUserImages() function, improve uploadImages() error handling
    │
    ├── pages/
    │   └── info/
    │       └── RecentPics.tsx              # MODIFY: Integrate GET /images/ API, improve upload flow, add background upload support
    │
    └── services/
        └── (no changes needed)
```

**Structure Decision**: Single React Native Expo project structure. Changes follow existing patterns:
- API functions in `api/` directory (like `auth.api.ts`, `matching.api.ts`)
- Screen components in `pages/info/` (onboarding screens)
- Centralized API client in `api/apiClient.ts` handles authentication
- No new directories needed, extends existing structure

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
