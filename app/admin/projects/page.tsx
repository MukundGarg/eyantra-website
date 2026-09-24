'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import AdminImageUpload from '@/components/AdminImageUpload'

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const initialForm = {
    title: '',
    slug: '',
    short_description: '',
    description: '',
    category: '',
    tech_stack: '', // String in form, array in DB
    cover_image: '',
    github_url: '',
    demo_url: '',
    year: new Date().getFullYear(),
    status: '',
    featured: false,
    display_order: 0,
    published: true
  }

  const [formData, setFormData] = useState(initialForm)

  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('display_order', { ascending: true })
    setProjects(data || [])
    setLoading(false)
  }

  const handleEdit = (project: any) => {
    setEditingId(project.id)
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      short_description: project.short_description || '',
      description: project.description || '',
      category: project.category || '',
      tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      cover_image: project.cover_image || '',
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      year: project.year || new Date().getFullYear(),
      status: project.status || '',
      featured: project.featured,
      display_order: project.display_order || 0,
      published: project.published
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData(initialForm)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert tech_stack string to array
    const techArray = formData.tech_stack.split(',').map(s => s.trim()).filter(s => s.length > 0)
    
    const submitData = {
      ...formData,
      tech_stack: techArray,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    if (editingId) {
      await supabase.from('projects').update(submitData).eq('id', editingId)
    } else {
      await supabase.from('projects').insert([submitData])
    }
    handleCancel()
    fetchProjects()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-white mb-6">Manage Projects</h1>
      
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#292D32] mb-8">
        <h2 className="text-lg font-bold font-mono text-white mb-4">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Title *</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Slug (auto-generated if empty)</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Short Description</label>
              <textarea value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono h-20" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Category</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Tech Stack (comma separated)</label>
              <input type="text" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">GitHub URL</label>
              <input type="text" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Demo URL</label>
              <input type="text" value={formData.demo_url} onChange={e => setFormData({...formData, demo_url: e.target.value})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Year</label>
              <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value) || 0})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-[#A6AAAE] text-sm font-mono mb-1">Display Order</label>
              <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} className="w-full bg-[#101010] border border-[#292D32] rounded p-2 text-white font-mono" />
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
              bucket="projects" 
              currentImageUrl={formData.cover_image} 
              onUploadSuccess={(url) => setFormData({...formData, cover_image: url})} 
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button type="submit" className="bg-[#d83a32] hover:bg-[#b02c25] text-white font-bold font-mono py-2 px-4 rounded transition-colors">
              {editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="bg-[#292D32] hover:bg-[#3a3f45] text-white font-bold font-mono py-2 px-4 rounded transition-colors">
                Cancel
              </button>
            )}
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
                  <th className="p-4">Category</th>
                  <th className="p-4">Order</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292D32]">
                {projects.map(project => (
                  <tr key={project.id} className="text-[#A6AAAE] hover:bg-[#292D32]/20">
                    <td className="p-4 font-bold text-white">{project.title}</td>
                    <td className="p-4">{project.category}</td>
                    <td className="p-4">{project.display_order}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs mr-2 ${project.published ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                      {project.featured && <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">Featured</span>}
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleEdit(project)} className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-[#A6AAAE]">No projects found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
