# Research: Fix Profile Image Upload During Onboarding

**Date**: 2025-01-27  
**Feature**: 002-fix-profile-image-upload

## Research Questions & Decisions

### 1. API Integration Pattern for GET /images/

**Question**: How should we integrate the GET /images/ endpoint to check for existing photos?

**Decision**: Use existing apiClient pattern with TypeScript types, add new `getUserImages()` function to `images.api.ts`

**Rationale**: 
- Consistent with existing API patterns (`auth.api.ts`, `matching.api.ts`)
- Centralized error handling via apiClient interceptors
- Type safety with TypeScript interfaces
- Reusable across app if needed later

**Alternatives Considered**:
- Direct axios calls: Rejected - breaks consistency, loses centralized error handling
- Separate service file: Rejected - unnecessary abstraction for single endpoint

**Implementation Notes**:
- Response type: `{ success: boolean, images: string[], total_images: number }`
- Error handling: Treat failures as "no photos exist" per spec clarification
- Authentication: Automatic via apiClient request interceptor

---

### 2. Token Refresh During Upload

**Question**: How should we handle token expiration during active upload operations?

**Decision**: Enhance apiClient response interceptor to automatically refresh token and retry failed requests

**Rationale**:
- Matches existing token refresh infrastructure in `auth.context.tsx`
- Provides seamless user experience (no manual re-authentication needed)
- Follows mobile app best practices for session management

**Alternatives Considered**:
- Manual token refresh in upload function: Rejected - code duplication, inconsistent error handling
- Cancel upload on 401: Rejected - poor UX, loses user progress

**Implementation Notes**:
- Use existing `authApi.refreshToken()` function
- Retry original request after successful refresh
- If refresh fails, trigger logout flow (existing behavior)

---

### 3. Background Upload Support

**Question**: How should we handle uploads when user navigates away or backgrounds the app?

**Decision**: Use React Native's background task capabilities with expo-task-manager (if available) or continue upload in foreground with proper state management

**Rationale**:
- Prevents data loss when user navigates away
- Better UX than canceling upload
- Matches mobile app expectations

**Alternatives Considered**:
- Cancel upload on navigation: Rejected - poor UX, loses user progress
- Queue for later: Rejected - adds complexity, user expects immediate upload

**Implementation Notes**:
- Use React state to track upload progress
- Show notification when upload completes (expo-notifications)
- Persist upload state in component state (not AsyncStorage - temporary)
- Handle app state changes (AppState API)

---

### 4. Error Handling Strategy

**Question**: How should we handle various error scenarios (network, validation, API errors)?

**Decision**: Multi-layered error handling: client-side validation before API call, API error handling via interceptors, user-friendly error messages

**Rationale**:
- Prevents unnecessary API calls for invalid data
- Provides immediate feedback to users
- Follows mobile UX best practices

**Alternatives Considered**:
- Server-only validation: Rejected - slower feedback, wastes API calls
- Generic error messages: Rejected - poor UX, users can't resolve issues

**Implementation Notes**:
- Validate file size/type before upload (5MB max, JPEG/JPG/PNG/WEBP)
- Validate photo count (max 6) before API call
- Map API error codes to user-friendly messages
- Provide retry option for transient failures

---

### 5. FormData Handling for Multipart Upload

**Question**: How should we format multipart/form-data for image uploads?

**Decision**: Use existing FormData pattern from `uploadImages()` function, ensure proper Content-Type handling

**Rationale**:
- Already implemented and working
- Follows React Native FormData API
- apiClient already handles Content-Type removal for FormData

**Alternatives Considered**:
- Base64 encoding: Rejected - larger payload, slower upload
- Separate uploads per image: Rejected - more API calls, slower overall

**Implementation Notes**:
- Use FormData.append() with file objects
- apiClient automatically removes Content-Type header for FormData
- Backend expects 'files' field with array of files

---

## Technology Choices

### Existing Stack (No Changes)
- **React Native 0.81.5**: Mobile framework
- **Expo ~54.0.23**: Development platform
- **TypeScript ~5.9.2**: Type safety
- **axios ^1.6.0**: HTTP client
- **expo-image-picker ^17.0.8**: Image selection
- **expo-notifications ^0.32.12**: Background notifications

### No New Dependencies Required
All required functionality exists in current stack:
- API client infrastructure: ✅
- Image picker: ✅
- Notifications: ✅
- Token refresh: ✅

---

## API Contract Decisions

### GET /images/ Endpoint
- **Path**: `/images/`
- **Method**: GET
- **Auth**: Bearer token (automatic via apiClient)
- **Response**: `{ success: boolean, images: string[], total_images: number }`
- **Error Handling**: Treat failures as empty array (no photos)

### POST /images/upload Endpoint
- **Path**: `/images/upload`
- **Method**: POST
- **Auth**: Bearer token (automatic via apiClient)
- **Content-Type**: multipart/form-data
- **Body**: FormData with 'files' field (array of image files)
- **Response**: `{ success: boolean, message: string, image_urls: string[], total_uploaded: number, user_total_images: number }`
- **Error Handling**: Validate response contains image_urls, treat empty array as failure

---

## Performance Considerations

### Image Upload Optimization
- **File Size**: Max 5MB per file (validated client-side before upload)
- **Batch Upload**: Upload all selected images in single request (more efficient)
- **Progress Tracking**: Show upload progress indicator
- **Timeout**: Use apiClient default timeout (likely 30s, verify)

### Network Handling
- **Retry Logic**: Implement retry for transient failures (network errors)
- **Timeout Handling**: Show user-friendly timeout error
- **Slow Network**: Show progress indicator, allow cancellation

---

## Security Considerations

### Authentication
- **Token Storage**: Uses existing secure storage (secureStorage.ts)
- **Token Refresh**: Automatic via apiClient interceptor
- **Token Expiration**: Handled gracefully with refresh and retry

### Data Protection
- **Image Privacy**: Images stored in Supabase Storage (backend responsibility)
- **Transport Security**: HTTPS enforced (apiClient baseURL)
- **File Validation**: Client-side validation prevents malicious file uploads

---

## Testing Strategy

### Manual Testing Required
1. **Happy Path**: Upload 1-6 photos successfully
2. **Error Scenarios**: Network failure, token expiration, invalid files
3. **Edge Cases**: Navigate away during upload, app backgrounding
4. **Validation**: File size, file type, photo count limits

### Integration Testing (Recommended)
- Mock API responses for GET /images/
- Mock API responses for POST /images/upload
- Test error handling paths
- Test token refresh flow

---

## Open Questions Resolved

All clarifications from spec phase have been resolved:
1. ✅ GET /images/ failure handling: Treat as "no photos exist"
2. ✅ Minimum photo requirement: Require at least 1 photo
3. ✅ Token expiration: Auto-refresh and retry
4. ✅ Navigation during upload: Continue in background
5. ✅ Empty response handling: Treat as failure

---

## References

- Existing API patterns: `package/app/api/auth.api.ts`, `package/app/api/matching.api.ts`
- API client: `package/app/api/apiClient.ts`
- Image upload function: `package/app/api/images.api.ts`
- Onboarding screen: `package/app/pages/info/RecentPics.tsx`
- Backend API docs: Provided in spec input

