'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface AdminImageUploadProps {
  bucket: 'team' | 'projects' | 'events'
  currentImageUrl?: string
  onUploadSuccess: (url: string) => void
}

export default function AdminImageUpload({ bucket, currentImageUrl, onUploadSuccess }: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      
      // Basic validation
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image.')
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB.')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      
      if (data.publicUrl) {
        onUploadSuccess(data.publicUrl)
        setPreviewUrl(data.publicUrl)
      }
    } catch (error: any) {
      setError(error.message)
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="relative w-48 h-48 border border-[#292D32] rounded overflow-hidden bg-[#101010]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          ref={fileInputRef}
          className="hidden"
          id={`upload-${bucket}`}
        />
        <label
          htmlFor={`upload-${bucket}`}
          className={`inline-block px-4 py-2 border border-[#292D32] rounded font-mono text-sm cursor-pointer transition-colors ${
            uploading 
              ? 'bg-[#292D32] text-[#A6AAAE] cursor-not-allowed' 
              : 'bg-[#1a1a1a] text-white hover:bg-[#292D32]'
          }`}
        >
          {uploading ? 'Uploading...' : 'Select Image'}
        </label>
      </div>
      
      {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
    </div>
  )
}
