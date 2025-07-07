'use client'

import { Button } from '@heroui/react'
import { animated, useSpring } from '@react-spring/web'
import Link from 'next/link'
import { type FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useProjects } from '@/app/hooks/useProjects'
import { Project } from '@/types/project.types'

// Import Swiper styles
import 'swiper/css'

export const Projects: FC = () => {
  const { t } = useTranslation()
  const { data: projects, isLoading } = useProjects()

  const [inView, setInView] = useState(false)

  const projectsContainerProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    config: { duration: 1000 },
  })

  const renderProjectCard = useCallback(
    (project: Project) => {
      return (
        <div className='flex h-full flex-1 shrink-0 justify-between rounded-lg border border-dashed border-zinc-300 px-5 py-[0.625rem]'>
          <div className='flex flex-1 flex-col gap-3 py-3'>
            <p className='text-xl font-semibold leading-7'>{project.name}</p>
            <div className='space-y-1'>
              <p className='flex items-center gap-1'>
                <span className='font-semibold text-gray-700'>{t('home:project_company')}:</span>
                <span className='text-gray-600'>{project.companyName}</span>
              </p>
              <p className='flex items-center gap-1'>
                <span className='font-semibold text-gray-700'>{t('home:project_capacity')}:</span>
                <span className='text-gray-600'>{project.capacity}</span>
              </p>
              <p className='flex items-center gap-1'>
                <span className='font-semibold text-gray-700'>{t('home:project_duration')}:</span>
                <span className='text-gray-600'>{project.time}</span>
              </p>
              <p className='flex items-center gap-1'>
                <span className='font-semibold text-gray-700'>{t('home:project_location')}:</span>
                <span className='text-gray-600'>{project.location}</span>
              </p>
            </div>
            <p className='line-clamp-2 text-sm text-gray-500'>{project.description}</p>
          </div>
          <div className='ml-4 flex flex-col items-end justify-between'>
            <Button as={Link} href={`projects/${project.id}`} className='mt-auto' color='primary'>
              {t('home:view_details')}
            </Button>
          </div>
        </div>
      )
    },
    [t],
  )

  const renderLoadingSkeleton = useCallback(() => {
    return (
      <div className='flex h-full flex-1 shrink-0 animate-pulse justify-between rounded-lg border border-dashed border-zinc-300 px-5 py-[0.625rem]'>
        <div className='flex flex-1 flex-col gap-3 py-3'>
          <div className='h-6 w-3/4 rounded bg-gray-200'></div>
          <div className='space-y-2'>
            <div className='h-4 w-full rounded bg-gray-200'></div>
            <div className='h-4 w-5/6 rounded bg-gray-200'></div>
            <div className='h-4 w-4/5 rounded bg-gray-200'></div>
            <div className='h-4 w-full rounded bg-gray-200'></div>
          </div>
          <div className='h-4 w-full rounded bg-gray-200'></div>
          <div className='h-4 w-2/3 rounded bg-gray-200'></div>
        </div>
        <div className='ml-4 flex flex-col items-end justify-between'>
          <div className='mb-2 h-16 w-20 rounded-md bg-gray-200'></div>
          <div className='h-8 w-24 rounded-md bg-gray-200'></div>
        </div>
      </div>
    )
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
        } else {
          setInView(false)
        }
      },
      { threshold: 0.5 },
    )

    const section = document.getElementById('projects-section')
    if (section) observer.observe(section)
    return () => {
      section && observer.unobserve(section)
    }
  }, [])

  return (
    <div className='flex flex-col gap-7 px-[0.875rem] py-10 sm:px-10 lg:gap-10 lg:py-20' id='projects-section'>
      <div className='flex w-full flex-col items-center justify-center gap-3 text-center lg:text-left'>
        <p className='text-2xl font-semibold leading-8 lg:text-4xl lg:leading-10'>{t('home:projects_heading')}</p>
        <p className='text-sm font-medium leading-5 text-gray-500 lg:text-lg lg:leading-7'>{t('home:projects_desc')}</p>
      </div>

      <animated.div style={projectsContainerProps}>
        <div className='mb-6 flex items-center justify-between'>
          <Link
            href='/projects'
            className='text-lg font-semibold underline transition-colors'
            style={{ color: '#155E75' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f4c5c'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#155E75'
            }}
          >
            {t('home:see_all_projects')}
          </Link>
        </div>

        <div className='projects-swiper'>
          {isLoading ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
              }}
              className='!pb-12'
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`} className='h-auto'>
                  {renderLoadingSkeleton()}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : projects && projects.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet-custom',
                bulletActiveClass: 'swiper-pagination-bullet-active-custom',
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
              }}
              className='!pb-12'
            >
              {projects.map((project) => (
                <SwiperSlide key={project.id} className='h-auto'>
                  {renderProjectCard(project)}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                <svg className='h-8 w-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                  />
                </svg>
              </div>
              <p className='mb-2 text-lg font-medium text-gray-900'>{t('home:no_projects_found')}</p>
              <p className='text-gray-500'>{t('home:no_projects_hint')}</p>
            </div>
          )}

          {!isLoading && projects && projects.length > 0 && (
            <div className='mt-6 flex justify-center gap-4'>
              <button
                className='swiper-button-prev-custom flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors'
                style={{ borderColor: '#155E75', color: '#155E75' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#155E75'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#155E75'
                }}
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='m15 18-6-6 6-6' />
                </svg>
              </button>
              <button
                className='swiper-button-next-custom flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors'
                style={{ borderColor: '#155E75', color: '#155E75' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#155E75'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#155E75'
                }}
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='m9 18 6-6-6-6' />
                </svg>
              </button>
            </div>
          )}
        </div>
      </animated.div>
    </div>
  )
}
