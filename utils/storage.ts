import { SupabaseClient } from '@supabase/supabase-js'

const ALLOWED_BUCKETS = ['team', 'projects', 'events'] as const

export type ManagedBucket = (typeof ALLOWED_BUCKETS)[number]

export function getManagedStoragePath(
  url: string | null | undefined,
  bucket: ManagedBucket
): string | null {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)

    const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseProjectUrl) return null

    const expectedOrigin = new URL(supabaseProjectUrl).origin

    // Only manage files belonging to OUR Supabase project.
    if (parsedUrl.origin !== expectedOrigin) {
      return null
    }

    const expectedPrefix = `/storage/v1/object/public/${bucket}/`

    if (!parsedUrl.pathname.startsWith(expectedPrefix)) {
      return null
    }

    const encodedObjectPath = parsedUrl.pathname.slice(expectedPrefix.length)

    if (!encodedObjectPath) {
      return null
    }

    const objectPath = decodeURIComponent(encodedObjectPath)

    // Prevent obviously invalid/root traversal-like paths.
    if (
      !objectPath ||
      objectPath === '.' ||
      objectPath === '..' ||
      objectPath.startsWith('../') ||
      objectPath.includes('/../')
    ) {
      return null
    }

    return objectPath
  } catch {
    return null
  }
}

export async function deleteManagedStorageImage(
  supabase: SupabaseClient,
  bucket: ManagedBucket,
  url: string | null | undefined
): Promise<boolean> {
  const path = getManagedStoragePath(url, bucket)

  if (!path) {
    return false
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error(
        `Failed to delete storage object "${path}" from bucket "${bucket}"`,
        error
      )
      return false
    }

    return true
  } catch (error) {
    console.error(
      `Exception while deleting storage object "${path}" from bucket "${bucket}"`,
      error
    )
    return false
  }
}
