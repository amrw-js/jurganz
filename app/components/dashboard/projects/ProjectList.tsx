'use client'

import { Button, Spinner } from '@heroui/react'
import { Plus } from 'lucide-react'

import { ProjectCard } from '@/app/components/dashboard/projects/ProjectCard'
import type { Project, ProjectFormData } from '@/types/project.types'

interface ProjectListProps {
  projects: Project[]
  loading: boolean
  searchTerm: string
  onUpdate: (id: string, data: ProjectFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onCreateNew: () => void
}

export function ProjectList({ projects, loading, searchTerm, onUpdate, onDelete, onCreateNew }: ProjectListProps) {
  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Spinner size='lg' color='primary' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-foreground'>
            {searchTerm ? `Search Results (${projects.length})` : `All Projects (${projects.length})`}
          </h2>
          <p className='text-sm text-default-500'>
            {searchTerm ? `Showing projects matching "${searchTerm}"` : 'Manage your projects and media files'}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className='py-12 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-default-100'>
            <Plus className='h-8 w-8 text-default-400' />
          </div>
          <h3 className='mb-2 text-lg font-medium text-foreground'>
            {searchTerm ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className='mb-6 text-sm text-default-500'>
            {searchTerm
              ? `No projects match "${searchTerm}". Try a different search term.`
              : 'Get started by creating your first project with photos and videos.'}
          </p>
          <Button color='primary' variant='flat' startContent={<Plus className='h-4 w-4' />} onPress={onCreateNew}>
            {searchTerm ? 'Create New Project' : 'Create Your First Project'}
          </Button>
        </div>
      )}
    </div>
  )
}
