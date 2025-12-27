/**
 * Images API Functions
 * 
 * Typed API functions for image upload endpoints.
 * Uses the central apiClient for requests.
 */

import apiClient from './apiClient';
import { ProfileImage } from './matching.types';

// Upload images API response
export interface UploadImagesResponse {
  success: boolean;
  message: string;
  image_urls: string[]; // Array of uploaded image URLs
  total_uploaded: number;
  user_total_images: number;
}

/**
 * Upload images to user profile
 * @param images - Array of image URIs (local file paths) to upload
 * @returns Array of uploaded image URLs
 * @throws 401 for unauthorized, 400 for validation errors
 */
export const uploadImages = async (images: string[]): Promise<string[]> => {
  // Create FormData for multipart/form-data upload
  const formData = new FormData();
  
  // Append each image to FormData
  images.forEach((imageUri, index) => {
    // Extract filename from URI or use default
    const filename = imageUri.split('/').pop() || `image_${index}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('files', {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);
  });

  // For FormData, axios will automatically set Content-Type with boundary
  // The request interceptor will:
  // 1. Add Authorization header
  // 2. Remove Content-Type header for FormData
  // So we don't need to do anything special here
  const response = await apiClient.post<UploadImagesResponse>(
    '/images/upload',
    formData
  );
  
  // Return array of image URLs from the response
  return response.data.image_urls || [];
};

