# Quick Start: Fix Profile Image Upload During Onboarding

**Date**: 2025-01-27  
**Feature**: 002-fix-profile-image-upload

## Overview

This guide provides a quick start for implementing the profile image upload fix during onboarding. The fix integrates GET /images/ and POST /images/upload API endpoints with proper error handling, token refresh, and background upload support.

## Implementation Steps

### 1. Add GET /images/ API Function

**File**: `package/app/api/images.api.ts`

Add new function to check for existing user photos:

```typescript
/**
 * Get user profile images
 * @returns Array of image URLs, empty array if no photos or on error
 */
export const getUserImages = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<GetImagesResponse>('/images/');
    return response.data.images || [];
  } catch (error: any) {
    // Treat failures as "no photos exist" per spec
    console.error('Error fetching user images:', error);
    return [];
  }
};

// Add response type
export interface GetImagesResponse {
  success: boolean;
  images: string[];
  total_images: number;
}
```

### 2. Enhance Upload Function Error Handling

**File**: `package/app/api/images.api.ts`

Update `uploadImages()` to validate response:

```typescript
export const uploadImages = async (images: string[]): Promise<string[]> => {
  // ... existing FormData creation ...
  
  const response = await apiClient.post<UploadImagesResponse>(
    '/images/upload',
    formData
  );
  
  // Validate response contains image URLs
  if (!response.data.image_urls || response.data.image_urls.length === 0) {
    throw new Error('Upload succeeded but no image URLs returned');
  }
  
  return response.data.image_urls;
};
```

### 3. Update RecentPics Component

**File**: `package/app/pages/info/RecentPics.tsx`

#### 3.1 Replace Profile Check with GET /images/ API

Replace the `authApi.getProfile()` check with `getUserImages()`:

```typescript
import { getUserImages } from '../../api/images.api';

// In useEffect for checking photos:
const checkPhotosAndRedirect = async () => {
  try {
    const images = await getUserImages();
    
    if (images.length > 0) {
      // Photos exist - redirect to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigation' }],
      });
      return;
    }
    
    // No photos exist - allow screen to proceed
    setCheckingPhotos(false);
  } catch (error) {
    console.error('Error checking photos:', error);
    // On error, treat as no photos and allow upload
    setCheckingPhotos(false);
  }
};
```

#### 3.2 Add Minimum Photo Validation

Add validation before allowing user to proceed:

```typescript
const handleContinue = async () => {
  const uploadedCount = imageData.filter(
    item => item.image && item.uploaded
  ).length;
  
  if (uploadedCount < 1) {
    Alert.alert(
      'Photo Required',
      'Please upload at least 1 photo to continue.'
    );
    return;
  }
  
  // Proceed to main app
  navigation.reset({
    index: 0,
    routes: [{ name: 'DrawerNavigation' }],
  });
};
```

#### 3.3 Add Background Upload Support

Handle app state changes to continue upload in background:

```typescript
import { AppState } from 'react-native';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'background' && uploading) {
      // Upload continues in background
      // Show notification when complete (handled in handleUploadImages)
    }
  });
  
  return () => subscription.remove();
}, [uploading]);
```

#### 3.4 Enhance Upload Error Handling

Update `handleUploadImages()` to handle empty response:

```typescript
const handleUploadImages = async (): Promise<boolean> => {
  // ... existing code ...
  
  try {
    const uploadedUrls = await uploadImages(localImages);
    
    // Validate we got URLs back
    if (!uploadedUrls || uploadedUrls.length === 0) {
      throw new Error('Upload succeeded but no image URLs returned');
    }
    
    // ... rest of existing code ...
  } catch (error: any) {
    // ... existing error handling ...
  }
};
```

### 4. Enhance Token Refresh in apiClient (Optional)

**File**: `package/app/api/apiClient.ts`

If not already implemented, add automatic token refresh on 401:

```typescript
import { authApi } from './auth.api';
import { getRefreshToken } from '../storage/secureStorage';

// In response interceptor:
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await getRefreshToken();
      
      if (refreshToken) {
        try {
          const response = await authApi.refreshToken(refreshToken);
          // Store new tokens
          await storeTokens({
            access_token: response.access_token,
            refresh_token: response.refresh_token || refreshToken,
            expires_at: response.expires_at,
          });
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.access_token}`;
          return apiClient.request(error.config);
        } catch (refreshError) {
          // Refresh failed - logout
          if (logoutCallback) logoutCallback();
        }
      } else {
        // No refresh token - logout
        if (logoutCallback) logoutCallback();
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Testing Checklist

### Manual Testing

- [ ] GET /images/ returns existing photos correctly
- [ ] GET /images/ failure treated as "no photos exist"
- [ ] Upload 1 photo successfully
- [ ] Upload 6 photos successfully
- [ ] Upload fails with >6 photos (validation)
- [ ] Upload fails with >5MB file (validation)
- [ ] Upload fails with invalid file type (validation)
- [ ] Token refresh works during upload
- [ ] Navigation away during upload continues upload
- [ ] Error messages are user-friendly
- [ ] Retry works after failure
- [ ] Cannot proceed without at least 1 photo

### Error Scenarios

- [ ] Network timeout handled gracefully
- [ ] 401 error triggers token refresh
- [ ] Token refresh failure triggers logout
- [ ] Empty response from upload treated as failure
- [ ] Partial upload success handled correctly

## Key Files Modified

1. `package/app/api/images.api.ts` - Add getUserImages(), enhance uploadImages()
2. `package/app/pages/info/RecentPics.tsx` - Integrate GET /images/, add validation, background upload
3. `package/app/api/apiClient.ts` - Enhance token refresh (if needed)

## Dependencies

No new dependencies required. Uses existing:
- `expo-image-picker` for image selection
- `expo-notifications` for background notifications
- `axios` for API calls
- `apiClient` for centralized API handling

## Next Steps

After implementation:
1. Test all scenarios manually
2. Verify error handling works correctly
3. Test on both iOS and Android
4. Verify token refresh flow
5. Test background upload behavior

