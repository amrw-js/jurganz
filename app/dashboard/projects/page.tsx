'use client'

import { Button, Input } from '@heroui/react'
import { FolderOpen, ImageIcon, Plus, Search, Users } from 'lucide-react'
import { useState } from 'react'

import { ProjectList } from '@/app/components/dashboard/projects/ProjectList'
import { useProjects } from '@/app/hooks/useProjects'
import { ProjectModal } from '@/app/modals/ProjectModal'
import type { ProjectFormData } from '@/types/project.types'

const ProjectsPage = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  console.log('Projects:', projects)

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddProject = async (data: ProjectFormData) => {
    try {
      await addProject(data)
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleUpdateProject = async (id: string, data: ProjectFormData) => {
    try {
      await updateProject(id, data)
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      deleteProject(id)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  // Calculate stats
  const totalPhotos = projects.reduce((acc, project) => acc + (project.photos?.length || 0), 0)
  const totalCapacity = projects.reduce((acc, project) => acc + project.capacity, 0)

  return (
    <div className='p-8'>
      {/* Stats Cards */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Total Projects</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{projects.length}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
              <FolderOpen className='h-6 w-6 text-primary' />
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Total Media</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{totalPhotos}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10'>
              <ImageIcon className='h-6 w-6 text-secondary' />
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Total Capacity</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{totalCapacity}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-success/10'>
              <Users className='h-6 w-6 text-success' />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className='mb-8 rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='relative max-w-md flex-1'>
            <Input
              placeholder='Search projects...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className='h-4 w-4 text-default-400' />}
              variant='bordered'
              className='w-full'
            />
          </div>

          <div className='flex items-center gap-4'>
            <Button
              color='primary'
              startContent={<Plus className='h-4 w-4' />}
              onPress={() => setIsAddModalOpen(true)}
              className='gap-2'
            >
              Add Project
            </Button>
          </div>
        </div>
      </div>

      {/* Projects List Container */}
      <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
        <ProjectList
          projects={filteredProjects}
          loading={loading}
          searchTerm={searchTerm}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          onCreateNew={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Add Project Modal */}
      <ProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddProject} />
    </div>
  )
}

export default ProjectsPage
