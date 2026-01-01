# Data Model: Fix Profile Image Upload During Onboarding

**Date**: 2025-01-27  
**Feature**: 002-fix-profile-image-upload

## Entities

### ProfileImage

Represents a user-uploaded profile photo stored in cloud storage.

**Attributes**:
- `id` (string): Unique identifier for the image record
- `image_url` (string): Public URL of the uploaded image (from Supabase Storage)
- `display_order` (number): Order in which image appears in profile (0-based index)

**Relationships**:
- Belongs to User (via user_id in backend)
- Stored in `user_profile_images` table (backend)

**Validation Rules**:
- Maximum 6 images per user (enforced by backend API)
- Image URL must be valid HTTPS URL
- Display order must be unique per user (0-5)

**State Transitions**:
- `selected` → User selects image from device
- `uploading` → Upload in progress
- `uploaded` → Successfully uploaded, URL received
- `failed` → Upload failed, can retry

---

### ImageUploadRequest

Represents a batch of photos selected for upload during onboarding.

**Attributes**:
- `images` (string[]): Array of local file URIs (from expo-image-picker)
- `validationStatus` (object): Client-side validation results
  - `valid` (boolean): Overall validation status
  - `errors` (string[]): Array of validation error messages
- `uploadState` (string): Current upload state ('idle' | 'uploading' | 'success' | 'failed')
- `uploadedUrls` (string[]): Array of uploaded image URLs (after successful upload)

**Validation Rules**:
- Minimum 1 image required
- Maximum 6 images allowed
- Each image max 5MB
- Supported formats: JPEG, JPG, PNG, WEBP

**State Transitions**:
- `idle` → User selects images, validation passes
- `uploading` → API call in progress
- `success` → All images uploaded successfully
- `failed` → Upload failed (partial or complete), can retry

---

### GetImagesResponse

API response from GET /images/ endpoint.

**Attributes**:
- `success` (boolean): Whether request succeeded
- `images` (string[]): Array of image URLs (empty if no photos)
- `total_images` (number): Total count of user's images

**Validation Rules**:
- If `success` is false, treat as empty array (no photos)
- `images` array may be empty even if `success` is true
- `total_images` should match `images.length`

---

### UploadImagesResponse

API response from POST /images/upload endpoint.

**Attributes**:
- `success` (boolean): Whether upload succeeded
- `message` (string): Human-readable status message
- `image_urls` (string[]): Array of uploaded image URLs (MUST be present if success=true)
- `total_uploaded` (number): Count of successfully uploaded images
- `user_total_images` (number): Total images user has after upload

**Validation Rules**:
- If `success` is true but `image_urls` is empty/missing, treat as failure
- `total_uploaded` should match `image_urls.length`
- `user_total_images` should be <= 6 (backend enforced)

---

## Data Flow

### Photo Check Flow

```
User reaches photo upload step
  ↓
Call GET /images/ API
  ↓
[Success] → Display existing photos OR [Failure] → Treat as no photos
  ↓
If photos exist (≥1) → Allow user to proceed
If no photos → Show upload interface
```

### Photo Upload Flow

```
User selects 1-6 photos
  ↓
Client-side validation (size, type, count)
  ↓
[Valid] → Create FormData → Call POST /images/upload
[Invalid] → Show error, prevent upload
  ↓
[Upload Success] → Validate response has image_urls
  ↓
[Valid Response] → Update UI, allow proceed
[Invalid Response] → Treat as failure, allow retry
```

### Token Refresh Flow

```
API call returns 401 Unauthorized
  ↓
apiClient interceptor detects 401
  ↓
Call authApi.refreshToken()
  ↓
[Success] → Retry original request
[Failure] → Trigger logout flow
```

---

## State Management

### Component State (RecentPics.tsx)

```typescript
interface ImageItem {
  id: string;
  image?: string;           // Local URI or uploaded URL
  uploaded?: boolean;       // Upload status
  profileImageId?: string; // Backend ID if uploaded
}

// State variables:
- imageData: ImageItem[]     // Selected images (max 6)
- uploadedImages: ProfileImage[] // Successfully uploaded images
- uploading: boolean          // Upload in progress
- uploadError: string | null  // Error message
- loading: boolean            // Initial load state
```

### API State

- **Authentication**: Managed by apiClient interceptors
- **Token Storage**: SecureStorage (access_token, refresh_token)
- **Upload Progress**: Component-level state (not persisted)

---

## Validation Rules Summary

### Client-Side Validation (Before API Call)

1. **Photo Count**:
   - Minimum: 1 photo required
   - Maximum: 6 photos allowed
   - Validation: Check `imageData.filter(item => item.image).length`

2. **File Size**:
   - Maximum: 5MB per file
   - Validation: Use `expo-image-picker` file size info or File API

3. **File Type**:
   - Allowed: JPEG, JPG, PNG, WEBP
   - Validation: Check file extension or MIME type

4. **File Format**:
   - Must be valid image file
   - Validation: Try to load image, check for errors

### Server-Side Validation (API Enforced)

1. **Authentication**: Bearer token required (401 if missing/invalid)
2. **Photo Count**: Max 6 photos per user (400 if exceeded)
3. **File Size**: Max 5MB per file (400 if exceeded)
4. **File Type**: JPEG, JPG, PNG, WEBP only (400 if invalid)

---

## Error States

### Network Errors
- **Timeout**: Request exceeds timeout limit
- **No Connection**: Device offline or network unavailable
- **Server Error**: 500+ status codes

### Validation Errors
- **File Size**: File exceeds 5MB limit
- **File Type**: Unsupported format
- **Photo Count**: Exceeds 6 photo limit
- **Missing Files**: No files provided in request

### Authentication Errors
- **401 Unauthorized**: Token expired or invalid
- **Token Refresh Failed**: Refresh token expired or invalid

### API Response Errors
- **Empty URLs**: Success=true but image_urls is empty
- **Partial Success**: Some images uploaded, others failed
- **Invalid Response**: Response format doesn't match expected schema

---

## Data Persistence

### Temporary State (Component)
- Selected images: Component state (lost on unmount)
- Upload progress: Component state (not persisted)

### Persistent State (Backend)
- Uploaded images: Stored in Supabase Storage + database
- User metadata: Updated with image URLs
- Display order: Stored in `user_profile_images` table

### No Local Persistence Needed
- Images are uploaded immediately (not queued)
- Onboarding state managed by backend profile data
- No need for offline queue (out of scope)

---

## TypeScript Interfaces

```typescript
// From existing codebase
interface ProfileImage {
  id: string;
  image_url: string;
  display_order: number;
}

// New interfaces for this feature
interface GetImagesResponse {
  success: boolean;
  images: string[];
  total_images: number;
}

interface UploadImagesResponse {
  success: boolean;
  message: string;
  image_urls: string[];
  total_uploaded: number;
  user_total_images: number;
}

interface ImageItem {
  id: string;
  image?: string;
  uploaded?: boolean;
  profileImageId?: string;
}
```

