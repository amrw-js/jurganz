'use client'

import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectCard } from '@/app/components/ProjectCard'
import { Section } from '@/app/components/Section/Section'
import { useProjects } from '@/app/hooks/useProjects'

export const Services = () => {
  const { data: projects } = useProjects()
  const { t } = useTranslation(['default', 'projects'])

  if (!projects || !projects.length) {
    return null
  }

  return (
    <Section className='flex flex-col !items-start gap-8 bg-slate-50 lg:gap-10'>
      <div className='flex flex-col gap-2 lg:gap-5'>
        <p className='text-xl font-medium leading-7'>{t('projects:projects_title')}</p>
        <p className='text-4xl font-semibold leading-10'>{t('projects:projects_subtitle')}</p>
      </div>
      <div className='flex w-full flex-col flex-wrap gap-5 lg:gap-10'>
        {projects.map((project, index) => (
          <Fragment key={project.id}>
            <ProjectCard project={project} showDivider={index < projects.length - 1} />
          </Fragment>
        ))}
      </div>
    </Section>
  )
}
