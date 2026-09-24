import { SupabaseClient } from '@supabase/supabase-js';

export function getManagedStoragePath(url: string | null | undefined, bucket: string): string | null {
  if (!url) return null;
  
  // Must be a supabase storage URL
  if (!url.includes('.supabase.co/storage/v1/object/public/')) {
    return null;
  }
  
  // The URL format is typically:
  // https://[PROJECT_REF].supabase.co/storage/v1/object/public/[BUCKET_NAME]/[OBJECT_PATH]
  
  const publicPathString = `/storage/v1/object/public/${bucket}/`;
  const bucketIndex = url.indexOf(publicPathString);
  
  if (bucketIndex === -1) {
    return null; // Doesn't match the expected bucket path
  }
  
  const objectPath = url.substring(bucketIndex + publicPathString.length);
  
  if (!objectPath) {
    return null;
  }
  
  return decodeURIComponent(objectPath);
}

export async function deleteManagedStorageImage(supabase: SupabaseClient, bucket: string, url: string | null | undefined): Promise<boolean> {
  const path = getManagedStoragePath(url, bucket);
  
  if (!path) {
    return false; // Nothing to delete or not a managed image
  }
  
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error(`Failed to delete storage object: ${path} from bucket: ${bucket}`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Exception while deleting storage object: ${path}`, err);
    return false;
  }
}
