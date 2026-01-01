# Feature Specification: Fix Profile Image Upload During Onboarding

**Feature Branch**: `002-fix-profile-image-upload`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "we have an issue in the end of the onboadring while we are uploading the image for the profile, we have to call those apis to check if there are photos and upload photos for this profile"

## Clarifications

### Session 2025-01-27

- Q: When GET /images/ API call fails (network error, 500, timeout), what should happen? → A: Treat failure as "no photos exist", allow user to proceed with upload
- Q: Is there a minimum number of photos required to complete onboarding, or can users proceed with 0 photos? → A: Require at least 1 photo before allowing user to proceed to main app
- Q: If authentication token expires while user is uploading photos, what should happen? → A: Automatically refresh token and retry upload; if refresh fails, show error and require re-authentication
- Q: If user navigates away (back button, app backgrounding, etc.) while photos are uploading, what should happen? → A: Continue upload in background, show notification when complete; if upload fails, allow retry when user returns
- Q: If POST /images/upload returns success=true but image_urls array is empty or missing, what should happen? → A: Treat as upload failure, display error message, allow user to retry upload

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Completes Profile Photo Upload During Onboarding (Priority: P1)

A user reaches the final step of onboarding where they need to upload profile photos. The system checks if the user already has photos, and if not, allows them to select and upload at least 1 photo (up to 6 photos maximum). After successfully uploading at least 1 photo, the user can proceed to the main app.

**Why this priority**: This is the critical path for completing onboarding. Without properly functioning photo upload, users cannot complete their profile setup and access the main app. This directly impacts user acquisition and onboarding completion rates.

**Independent Test**: Can be fully tested by completing onboarding up to the photo upload step, selecting photos, uploading them, and verifying they are saved and the user can proceed. The test delivers value by ensuring users can successfully complete their profile setup.

**Acceptance Scenarios**:

1. **Given** a user reaches the photo upload step during onboarding, **When** the system checks for existing photos, **Then** it calls the GET /images/ API endpoint to retrieve any existing profile images, and if the call fails, treats it as "no photos exist" and allows upload
2. **Given** a user has no existing photos, **When** they select photos from their device, **Then** the system allows them to select at least 1 photo (up to 6 photos maximum)
3. **Given** a user has selected at least 1 photo to upload, **When** they confirm the upload, **Then** the system calls the POST /images/upload API endpoint with the selected images
4. **Given** at least 1 photo is successfully uploaded, **When** the upload completes, **Then** the system receives image URLs and updates the user's profile, allowing them to proceed to the main app
5. **Given** a user attempts to proceed without uploading any photos, **When** they try to continue, **Then** the system prevents progression and requires at least 1 photo to be uploaded
6. **Given** a user already has at least 1 photo uploaded, **When** they reach the photo upload step, **Then** the system detects existing photos and allows them to proceed without requiring new uploads

---

### User Story 2 - System Handles Photo Upload Errors Gracefully (Priority: P2)

When photo upload fails due to network issues, file size limits, or API errors, the system displays clear error messages and allows the user to retry the upload without losing their progress.

**Why this priority**: Error handling ensures users don't get stuck during onboarding and understand what went wrong. This improves user experience and reduces support requests.

**Independent Test**: Can be fully tested by simulating upload failures (network errors, oversized files, API errors) and verifying appropriate error messages are shown with retry options. The test delivers value by ensuring users can recover from errors.

**Acceptance Scenarios**:

1. **Given** a user attempts to upload photos, **When** the network request fails, **Then** the system displays a user-friendly error message and provides a retry option
6. **Given** a user's authentication token expires during photo upload, **When** the upload fails with 401 error, **Then** the system automatically refreshes the token and retries the upload; if refresh fails, displays error and requires re-authentication
7. **Given** a user navigates away during photo upload, **When** the upload is in progress, **Then** the system continues upload in background and shows notification when complete; if upload fails, allows retry when user returns
8. **Given** POST /images/upload returns success=true but image_urls array is empty or missing, **When** the response is received, **Then** the system treats it as upload failure, displays error message, and allows user to retry upload
2. **Given** a user selects a photo larger than 5MB, **When** they attempt to upload, **Then** the system validates file size and displays an error message before upload
3. **Given** a user selects an unsupported file type, **When** they attempt to upload, **Then** the system validates file type and displays an error message before upload
4. **Given** a user attempts to upload more than 6 photos, **When** they try to add additional photos, **Then** the system prevents selection beyond the limit and informs the user
5. **Given** a partial upload failure occurs (some photos succeed, others fail), **When** the API returns partial success, **Then** the system displays which photos uploaded successfully and allows retry for failed ones

---

### Edge Cases

- **Resolved**: When GET /images/ API call fails during photo check, system treats it as "no photos exist" and allows user to proceed with upload
- **Resolved**: When authentication token expires during upload, system automatically refreshes token and retries upload; if refresh fails, shows error and requires re-authentication
- **Resolved**: When user navigates away during upload, system continues upload in background, shows notification when complete; if upload fails, allows retry when user returns
- **Resolved**: When POST /images/upload returns success but no image URLs, system treats as upload failure, displays error, and allows retry
- **Resolved**: When user navigates away during upload, system continues upload in background, shows notification when complete; if upload fails, allows retry when user returns
- How does the system handle concurrent upload attempts?
- What happens when the user has exactly 6 photos and tries to upload more?
- How does the system handle very slow network connections during upload?
- **Resolved**: When API returns success but no image URLs, system treats as upload failure, displays error, and allows retry
- How does the system handle users who upload photos but then delete their account before onboarding completes?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST call GET /images/ API endpoint to check for existing user photos when the photo upload step is reached during onboarding
- **FR-001a**: System MUST treat GET /images/ API failures (network errors, 500 errors, timeouts) as "no photos exist" and allow user to proceed with photo upload
- **FR-002**: System MUST display existing photos if any are found via the GET /images/ API response
- **FR-003**: System MUST allow users to select photos from their device when no photos exist or when adding additional photos
- **FR-003a**: System MUST require at least 1 photo to be uploaded before allowing user to proceed to the main app
- **FR-004**: System MUST validate selected photos before upload (file size max 5MB, file types: JPEG, JPG, PNG, WEBP)
- **FR-005**: System MUST enforce a maximum of 6 photos per user
- **FR-006**: System MUST call POST /images/upload API endpoint with selected photos when user confirms upload
- **FR-007**: System MUST include authentication Bearer token in Authorization header for both GET /images/ and POST /images/upload API calls
- **FR-008**: System MUST send photos as multipart/form-data with Content-Type header for POST /images/upload requests
- **FR-009**: System MUST handle and display API error responses (401 unauthorized, 400 validation errors, 500 server errors)
- **FR-009a**: System MUST automatically refresh authentication token and retry upload when token expires during upload; if token refresh fails, display error and require user to re-authenticate
- **FR-010**: System MUST update the user interface with uploaded image URLs received from POST /images/upload response
- **FR-010a**: System MUST validate that POST /images/upload response contains image URLs; if success=true but image_urls is empty or missing, treat as failure and allow retry
- **FR-011**: System MUST allow users to proceed to the main app after successfully uploading at least 1 photo
- **FR-011a**: System MUST prevent users from proceeding to the main app if they have not uploaded at least 1 photo
- **FR-012**: System MUST allow users to retry failed uploads without losing selected photos
- **FR-013**: System MUST display upload progress or loading state during photo upload operations
- **FR-013a**: System MUST continue photo upload in background if user navigates away during upload, and show notification when upload completes
- **FR-014**: System MUST handle partial upload success scenarios (when some photos upload successfully and others fail)
- **FR-014a**: System MUST allow retry of failed uploads when user returns to screen after navigating away during upload

### Key Entities *(include if feature involves data)*

- **Profile Images**: Represents user-uploaded photos stored in cloud storage, associated with user account, includes image URL, display order, and upload status
- **Image Upload Request**: Represents a batch of photos selected for upload, includes file data, validation status, and upload state
- **API Response**: Represents server response containing success status, image URLs, total uploaded count, and user total images count

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see their existing photos (if any) displayed within 2 seconds of reaching the photo upload step
- **SC-002**: Users can upload up to 6 photos successfully in a single upload operation, with 95% success rate
- **SC-003**: Photo upload completes successfully for 90% of users on first attempt
- **SC-004**: Users receive clear error messages for 100% of upload failures, enabling them to understand and resolve the issue
- **SC-005**: Users can complete the photo upload step and proceed to the main app within 1 minute of selecting photos (excluding photo selection time)
- **SC-006**: System correctly identifies existing photos for 100% of users who have previously uploaded photos, preventing duplicate uploads
- **SC-007**: Upload failures due to validation errors (file size, file type, count limits) are caught and displayed before API call in 100% of cases

## Assumptions

- Users have valid authentication tokens when reaching the photo upload step
- The backend API endpoints (/images/ and /images/upload) are available and functioning correctly
- Users have device permissions to access their photo library
- Network connectivity is available during upload (with appropriate error handling for when it's not)
- The maximum of 6 photos per user is enforced by both frontend validation and backend API
- File size validation (5MB max) matches backend constraints
- Supported file types (JPEG, JPG, PNG, WEBP) match backend API requirements
- The onboarding flow correctly routes users to the photo upload step after completing previous steps

## Dependencies

- Backend API endpoints must be available: GET /images/ and POST /images/upload
- Authentication system must provide valid Bearer tokens for API requests
- Image picker functionality must be available on user devices
- Network connectivity required for API calls

## Out of Scope

- Photo editing or cropping functionality (assumed to be handled by image picker)
- Photo deletion during onboarding (only upload is in scope)
- Photo reordering during onboarding
- Bulk photo import from social media or cloud storage
- Photo compression or optimization before upload
- Offline photo upload queue functionality
