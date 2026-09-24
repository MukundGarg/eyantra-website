'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import AdminImageUpload from '@/components/AdminImageUpload'
import { TeamMember } from '@/types/index'
import { deleteManagedStorageImage } from '@/utils/storage'
import { isValidHttpUrl } from '@/utils/validation'

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'mentors',
    department: '',
    image_url: '',
    linkedin_url: '',
    github_url: '',
    display_order: 0,
    active: true
  })

  const [supabase] = useState(() => createClient())

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true })
    if (error) {
      setErrorMsg(`Failed to fetch: ${error.message}`)
    }
    setMembers(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers()
  }, [fetchMembers])

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setFormData({
      name: member.name || '',
      role: member.role || '',
      category: member.category || 'mentors',
      department: member.department || '',
      image_url: member.image_url || '',
      linkedin_url: member.linkedin_url || '',
      github_url: member.github_url || '',
      display_order: member.display_order || 0,
      active: member.active
    })
    setErrorMsg(null)
  }

  const handleCancel = async () => {
    if (!editingId && formData.image_url) {
      await deleteManagedStorageImage(supabase, 'team', formData.image_url)
    } else if (editingId) {
      const member = members.find(m => m.id === editingId)
      if (member && member.image_url !== formData.image_url && formData.image_url) {
        await deleteManagedStorageImage(supabase, 'team', formData.image_url)
      }
    }
    setEditingId(null)
    setFormData({
      name: '',
      role: '',
      category: 'mentors',
      department: '',
      image_url: '',
      linkedin_url: '',
      github_url: '',
      display_order: 0,
      active: true
    })
    setErrorMsg(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return
    setErrorMsg(null)
    
    const member = members.find(m => m.id === id)
    
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) {
      setErrorMsg(`Failed to delete: ${error.message}`)
    } else {
      if (member && member.image_url) {
        await deleteManagedStorageImage(supabase, 'team', member.image_url)
      }
      fetchMembers()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    
    setSaving(true)
    setErrorMsg(null)

    const submitData = { 
      ...formData, 
      name: formData.name.trim(),
      linkedin_url: formData.linkedin_url.trim(),
      github_url: formData.github_url.trim()
    }

    // Enforce URL validity
    if (submitData.linkedin_url && !isValidHttpUrl(submitData.linkedin_url)) {
       setErrorMsg("LinkedIn URL must be a valid http(s) link");
       setSaving(false);
       return;
    }
    if (submitData.github_url && !isValidHttpUrl(submitData.github_url)) {
       setErrorMsg("GitHub URL must be a valid http(s) link");
       setSaving(false);
       return;
    }

    // Clear department if core
    if (submitData.category === 'core') {
       submitData.department = '';
    }

    let opError = null;
    let oldImageUrl = null;

    if (editingId) {
      const existingMember = members.find(m => m.id === editingId);
      if (existingMember) oldImageUrl = existingMember.image_url;
      const { error } = await supabase.from('team_members').update(submitData).eq('id', editingId)
      opError = error;
    } else {
      const { error } = await supabase.from('team_members').insert([submitData])
      opError = error;
    }

    setSaving(false)

    if (opError) {
      setErrorMsg(`Failed to save: ${opError.message}`)
      return // Do not clear form on failure
    }
    
    if (editingId && oldImageUrl && oldImageUrl !== submitData.image_url) {
      await deleteManagedStorageImage(supabase, 'team', oldImageUrl);
    }
    
    setEditingId(null)
    setFormData({
      name: '',
      role: '',
      category: 'mentors',
      department: '',
      image_url: '',
      linkedin_url: '',
      github_url: '',
      display_order: 0,
      active: true
    })
    setErrorMsg(null)
    fetchMembers()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-white mb-6">Manage Team</h1>
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 font-mono text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#292D32] mb-8">
        <h2 className="text-lg font-bold font-mono text-white mb-4">
          {editingId ? 'Edit Member' : 'Add New Member'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Role/Designation</label>
              <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Category *</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono">
                <option value="mentors">Mentors</option>
                <option value="core">Core Leadership</option>
                <option value="departments">Departments</option>
              </select>
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Department (if applicable)</label>
              {formData.category === 'departments' ? (
                <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono">
                  <option value="">Select a Department</option>
                  <option value="software">Software</option>
                  <option value="hardware">Hardware</option>
                  <option value="media-design">Media & Design</option>
                  <option value="pr-sponsorship">PR & Sponsorship</option>
                  <option value="events-marketing">Events & Marketing</option>
                  <option value="technical">Technical (Legacy)</option>
                  <option value="management">Management (Legacy)</option>
                </select>
              ) : (
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} disabled={saving || formData.category === 'core'} placeholder={formData.category === 'core' ? "Not applicable for core" : "Enter department"} className={`w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono ${formData.category === 'core' ? 'opacity-50' : ''}`} />
              )}
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">LinkedIn URL</label>
              <input type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">GitHub URL</label>
              <input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Display Order</label>
              <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} disabled={saving} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} disabled={saving} className="mr-2" />
              <label htmlFor="active" className="text-[#A6AAAE] text-sm font-mono cursor-pointer">Active / Visible</label>
            </div>
          </div>
          
          <div className="pt-2 border-t border-[#292D32]">
            <label className="block text-[#A6AAAE] text-sm font-mono mb-2">Profile Image</label>
            <AdminImageUpload 
              bucket="team" 
              currentImageUrl={formData.image_url} 
              onUploadSuccess={async (url) => {
                if (formData.image_url) {
                  const isPersisted = editingId && members.find(m => m.id === editingId)?.image_url === formData.image_url;
                  if (!isPersisted) {
                    await deleteManagedStorageImage(supabase, 'team', formData.image_url);
                  }
                }
                setFormData({...formData, image_url: url})
              }} 
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button type="submit" disabled={saving} className="bg-[#d83a32] hover:bg-[#b02c25] text-white font-bold font-mono py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : (editingId ? 'Update Member' : 'Add Member')}
            </button>
            {editingId || (!editingId && (formData.name || formData.image_url)) ? (
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
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Order</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292D32]">
                {members.map(member => (
                  <tr key={member.id} className="text-[#A6AAAE] hover:bg-[#292D32]/20">
                    <td className="p-4">{member.name} <br/><span className="text-xs opacity-50">{member.role}</span></td>
                    <td className="p-4">{member.category}</td>
                    <td className="p-4">{member.display_order}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${member.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleEdit(member)} className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDelete(member.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-[#A6AAAE]">No members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
