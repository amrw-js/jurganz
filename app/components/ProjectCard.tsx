'use client'

import { Divider } from '@heroui/react'
import { ArrowUpRight, Building2, Clock, Factory, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { Project } from '@/types/project.types'

import 'swiper/css'

interface ProjectCardProps {
  project: Project
  showDivider?: boolean
}

export const ProjectCard = ({ project, showDivider = true }: ProjectCardProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  const hasMedia = project.media && project.media.length > 0

  const handleProjectClick = () => {
    router.push(`/projects/${project.id}`)
  }

  const trimDescription = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <>
      <div
        className='group -m-2 flex cursor-pointer flex-col-reverse gap-6 rounded-2xl p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg lg:flex-row lg:gap-12'
        onClick={handleProjectClick}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleProjectClick()
          }
        }}
      >
        {/* Media Section */}
        <div className='relative h-[180px] w-full shrink-0 lg:h-[280px] lg:w-[520px]'>
          {hasMedia ? (
            <div className='h-full w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:ring-gray-300'>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet !bg-white/70 !w-3 !h-3 !mx-1',
                  bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125',
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                className='project-swiper h-full w-full'
              >
                {project.media!.map((media) => (
                  <SwiperSlide key={media.id}>
                    {media.type === 'image' ? (
                      <div className='relative h-full w-full'>
                        <Image
                          src={media.url || '/placeholder.svg'}
                          alt={media.name || project.name}
                          fill
                          className='object-cover transition-transform duration-500 group-hover:scale-105'
                          sizes='(max-width: 1024px) 100vw, 520px'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
                      </div>
                    ) : (
                      <video
                        src={media.url}
                        className='h-full w-full object-cover'
                        controls
                        poster='/images/logo.png'
                        preload='metadata'
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </SwiperSlide>
                ))}

                {project.media!.length > 1 && (
                  <>
                    <div className='swiper-button-prev ...' onClick={(e) => e.stopPropagation()} />
                    <div className='swiper-button-next ...' onClick={(e) => e.stopPropagation()} />
                  </>
                )}

                {project.media!.length > 1 && (
                  <div className='absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm'>
                    {project.media!.length} {t('projects:photos')}
                  </div>
                )}
              </Swiper>
            </div>
          ) : (
            <div className='relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg'>
              <Image
                src='/images/logo.png'
                alt='Project placeholder'
                fill
                className='object-cover opacity-50'
                sizes='(max-width: 1024px) 100vw, 520px'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center'>
                  <Building2 className='mx-auto h-12 w-12 text-gray-400' />
                  <p className='mt-2 text-sm text-gray-500'>{t('projects:no_media')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project Info Section */}
        <div className='flex w-full flex-1 justify-between'>
          <div className='flex flex-1 flex-col gap-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-4'>
                <h2 className='text-2xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-gray-700 lg:text-3xl'>
                  {project.name}
                </h2>
              </div>

              {project.description && (
                <p className='text-sm leading-relaxed text-gray-600 lg:text-base'>
                  {trimDescription(project.description, 150)}
                </p>
              )}
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors group-hover:bg-gray-100'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 group-hover:bg-gray-200'>
                  <Building2 className='h-5 w-5 text-gray-600' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>{t('projects:company')}</p>
                  <p className='truncate text-sm font-semibold text-gray-900 lg:text-base'>
                    {project.companyName || t('projects:not_specified')}
                  </p>
                </div>
              </div>

              {project.location && (
                <div className='group-hover:bg-gray-150 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-100 p-3 transition-colors'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-200 group-hover:bg-gray-300'>
                    <MapPin className='h-5 w-5 text-gray-600' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                      {t('projects:location')}
                    </p>
                    <p className='truncate text-sm font-semibold text-gray-900 lg:text-base'>{project.location}</p>
                  </div>
                </div>
              )}

              <div className='group-hover:bg-gray-150 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-100 p-3 transition-colors'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-200 group-hover:bg-gray-300'>
                  <Factory className='h-5 w-5 text-gray-600' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>{t('projects:capacity')}</p>
                  <p className='truncate text-sm font-semibold text-gray-900 lg:text-base'>{project.capacity}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors group-hover:bg-gray-100'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 group-hover:bg-gray-200'>
                  <Clock className='h-5 w-5 text-gray-600' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>{t('projects:duration')}</p>
                  <p className='truncate text-sm font-semibold text-gray-900 lg:text-base'>{project.time}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-start pt-2'>
            <div className='rounded-full border border-gray-200 bg-gray-100 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-200'>
              <ArrowUpRight className='h-6 w-6 text-gray-600 transition-colors group-hover:text-gray-700 lg:h-8 lg:w-8' />
            </div>
          </div>
        </div>
      </div>

      {showDivider && (
        <div className='relative my-8'>
          <Divider className='bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='h-2 w-2 rounded-full bg-gray-400'></div>
          </div>
        </div>
      )}
    </>
  )
}
