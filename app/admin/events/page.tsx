'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import AdminImageUpload from '@/components/AdminImageUpload'
import { Event } from '@/types/index'
import { deleteManagedStorageImage } from '@/utils/storage'
import { isValidHttpUrl } from '@/utils/validation'

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const initialForm = {
    title: '',
    slug: '',
    event_type: '',
    short_description: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    cover_image: '',
    registration_url: '',
    status: 'upcoming',
    featured: false,
    display_order: 0,
    published: true
  }

  const [formData, setFormData] = useState(initialForm)

  const [supabase] = useState(() => createClient())

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('events').select('*').order('display_order', { ascending: true })
    if (error) {
      setErrorMsg(`Failed to fetch: ${error.message}`)
    }
    setEvents(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents()
  }, [fetchEvents])

  const handleEdit = (event: Event) => {
    setEditingId(event.id)
    setFormData({
      title: event.title || '',
      slug: event.slug || '',
      event_type: event.event_type || '',
      short_description: event.short_description || '',
      description: event.description || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '',
      event_time: event.event_time || '',
      location: event.location || '',
      cover_image: event.cover_image || '',
      registration_url: event.registration_url || '',
      status: event.status || 'upcoming',
      featured: event.featured,
      display_order: event.display_order || 0,
      published: event.published
    })
    setErrorMsg(null)
  }

  const handleCancel = async () => {
    if (!editingId && formData.cover_image) {
      await deleteManagedStorageImage(supabase, 'events', formData.cover_image)
    } else if (editingId) {
      const event = events.find(e => e.id === editingId)
      if (event && event.cover_image !== formData.cover_image && formData.cover_image) {
        await deleteManagedStorageImage(supabase, 'events', formData.cover_image)
      }
    }
    setEditingId(null)
    setFormData(initialForm)
    setErrorMsg(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    setErrorMsg(null)
    
    const event = events.find(e => e.id === id)
    
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      setErrorMsg(`Failed to delete: ${error.message}`)
    } else {
      if (event && event.cover_image) {
        await deleteManagedStorageImage(supabase, 'events', event.cover_image)
      }
      fetchEvents()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    
    setSaving(true)
    setErrorMsg(null)
    
    const slugToUse = (formData.slug || formData.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const submitData = {
      ...formData,
      title: formData.title.trim(),
      slug: slugToUse,
      event_date: formData.event_date ? formData.event_date : null,
      registration_url: formData.registration_url.trim()
    }

    if (submitData.registration_url && !isValidHttpUrl(submitData.registration_url)) {
      setErrorMsg("Registration URL must be a valid http(s) link");
      setSaving(false);
      return;
    }

    let opError = null;
    let oldImageUrl = null;

    if (editingId) {
      const existingEvent = events.find(e => e.id === editingId);
      if (existingEvent) oldImageUrl = existingEvent.cover_image;
      const { error } = await supabase.from('events').update(submitData).eq('id', editingId)
      opError = error;
    } else {
      const { error } = await supabase.from('events').insert([submitData])
      opError = error;
    }

    setSaving(false)
    
    if (opError) {
      if (opError.code === '23505') { // unique violation
        setErrorMsg('Failed to save: An event with this slug already exists.');
      } else {
        setErrorMsg(`Failed to save: ${opError.message}`)
      }
      return
    }
    
    if (editingId && oldImageUrl && oldImageUrl !== submitData.cover_image) {
      await deleteManagedStorageImage(supabase, 'events', oldImageUrl);
    }
    
    setEditingId(null)
    setFormData(initialForm)
    setErrorMsg(null)
    fetchEvents()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-white mb-6">Manage Events</h1>
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 font-mono text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#292D32] mb-8">
        <h2 className="text-lg font-bold font-mono text-white mb-4">
          {editingId ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Title *</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Slug (auto-generated if empty)</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Short Description</label>
              <textarea value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono h-20" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Event Type (Category)</label>
              <input type="text" value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Registration URL (External)</label>
              <input type="url" value={formData.registration_url} onChange={e => setFormData({...formData, registration_url: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Date</label>
              <input type="date" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Time</label>
              <input type="text" value={formData.event_time} onChange={e => setFormData({...formData, event_time: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Display Order</label>
              <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            
            <div className="md:col-span-2 flex gap-6 mt-2">
              <div className="flex items-center">
                <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="mr-2" />
                <label htmlFor="published" className="text-[#A6AAAE] text-sm font-mono cursor-pointer">Published</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="mr-2" />
                <label htmlFor="featured" className="text-[#A6AAAE] text-sm font-mono cursor-pointer">Featured</label>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-[#292D32]">
            <label className="block text-[#A6AAAE] text-sm font-mono mb-2">Cover Image</label>
            <AdminImageUpload 
              bucket="events" 
              currentImageUrl={formData.cover_image} 
              onUploadSuccess={async (url) => {
                if (formData.cover_image) {
                  const isPersisted = editingId && events.find(e => e.id === editingId)?.cover_image === formData.cover_image;
                  if (!isPersisted) {
                    await deleteManagedStorageImage(supabase, 'events', formData.cover_image);
                  }
                }
                setFormData({...formData, cover_image: url})
              }} 
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button type="submit" disabled={saving} className="bg-[#d83a32] hover:bg-[#b02c25] text-white font-bold font-mono py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : (editingId ? 'Update Event' : 'Add Event')}
            </button>
            {editingId || (!editingId && (formData.title || formData.cover_image)) ? (
              <button type="button" onClick={handleCancel} disabled={saving} className="bg-[#292D32] hover:bg-[#3a3f45] text-white font-bold font-mono py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#292D32] overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-[#A6AAAE] font-mono">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead className="bg-[#292D32] text-white">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Status / Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292D32]">
                {events.map(event => (
                  <tr key={event.id} className="text-[#A6AAAE] hover:bg-[#292D32]/20">
                    <td className="p-4 font-bold text-white">{event.title}</td>
                    <td className="p-4">{event.status} <span className="opacity-50">/ {event.event_type}</span></td>
                    <td className="p-4">{event.event_date ? new Date(event.event_date).toLocaleDateString() : '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs mr-2 ${event.published ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {event.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleEdit(event)} className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-[#A6AAAE]">No events found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
