'use client'

import { useState } from 'react'

interface Project {
  id: string
  name: string
  capacity: string
  time: string
  photos: string[]
}

export const ProjectItem = ({ project }: { project: Project }) => {
  const [photos, setPhotos] = useState<string[]>(project.photos)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const fileUrls = files.map((file) => URL.createObjectURL(file))
    setPhotos((prev) => [...prev, ...fileUrls])
  }

  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm'>
      <h2 className='text-lg font-medium'>{project.name}</h2>
      <p className='text-sm text-gray-600'>Capacity: {project.capacity}</p>
      <p className='text-sm text-gray-600'>Time: {project.time}</p>

      <div className='mt-4'>
        <label className='mb-1 block text-sm font-medium'>Add Photos</label>
        <input type='file' multiple onChange={handlePhotoUpload} />
        <div className='mt-2 flex flex-wrap gap-2'>
          {photos.map((url, idx) => (
            <img key={idx} src={url} alt={`Project ${idx}`} className='h-20 w-20 rounded object-cover' />
          ))}
        </div>
      </div>
    </div>
  )
}
