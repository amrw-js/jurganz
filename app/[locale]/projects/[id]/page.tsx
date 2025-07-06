'use client'

import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react'
import {
  ArrowLeftIcon,
  Building2,
  Calendar,
  Camera,
  Clock,
  Edit3,
  Factory,
  MapPin,
  Play,
  Share2,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import { Autoplay, EffectFade, Navigation, Pagination, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useProject } from '@/app/hooks/useProjects'

// Import Swiper styles
import 'swiper/css'

export default function ProjectDetailPage() {
  const { t } = useTranslation('project')
  const { id } = useParams()
  const { data: project, isLoading, error } = useProject(id as string)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='flex flex-col items-center gap-8'>
          <div className='relative'>
            <div className='h-20 w-20 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Building2 className='h-8 w-8 text-gray-600' />
            </div>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-semibold text-gray-800'>{t('loading_title')}</p>
            <p className='mt-2 text-gray-600'>{t('loading_subtitle')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Card className='max-w-lg border border-gray-200 shadow-xl'>
          <CardBody className='p-12 text-center'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100'>
              <ArrowLeftIcon className='h-10 w-10 text-gray-600' />
            </div>
            <h3 className='mb-4 text-3xl font-bold text-gray-800'>{t('not_found_title')}</h3>
            <p className='mb-8 text-lg leading-relaxed text-gray-600'>{t('not_found_description')}</p>
            <Button
              as={Link}
              href='/projects'
              color='default'
              size='lg'
              className='w-full bg-gray-800 font-semibold text-white hover:bg-gray-900'
            >
              {t('back_to_projects')}
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  const hasMedia = project.media && project.media.length > 0
  const imageCount = project.media?.filter((m) => m.type === 'image').length || 0
  const videoCount = project.media?.filter((m) => m.type === 'video').length || 0

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Professional Header */}
      <div className='sticky top-20 z-30 border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-6'>
              <Button
                as={Link}
                href='/projects'
                isIconOnly
                variant='flat'
                className='border border-gray-200 bg-gray-100 hover:bg-gray-200'
              >
                <ArrowLeftIcon className='h-5 w-5 text-gray-600' />
              </Button>

              <div className='flex items-center gap-4'>
                <div>
                  <div className='mb-2 flex items-center gap-4'>
                    <h1 className='text-3xl font-bold text-gray-900 lg:text-4xl'>{project.name}</h1>
                  </div>

                  <div className='flex items-center gap-4 text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Building2 className='h-4 w-4 text-gray-500' />
                      <p className='font-medium'>{project.companyName}</p>
                    </div>
                    {project.location && (
                      <>
                        <div className='h-4 w-px bg-gray-300'></div>
                        <div className='flex items-center gap-2'>
                          <MapPin className='h-4 w-4 text-gray-500' />
                          <p className='font-medium'>{project.location}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl space-y-8 p-6'>
        {/* Professional Media Gallery */}
        {hasMedia && (
          <Card className='border border-gray-200 shadow-lg'>
            <CardBody className='p-0'>
              <div className='space-y-6 p-8'>
                {/* Gallery Header */}
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-start text-2xl font-bold text-gray-900'>{t('gallery_title')}</h2>
                    <p className='text-gray-600'>
                      {t('gallery_stats', {
                        count: project.media!.length,
                        images: imageCount,
                        videos: videoCount,
                      })}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Chip
                      variant='flat'
                      className='border border-gray-200 bg-gray-100 text-gray-700'
                      startContent={<Camera className='h-3 w-3' />}
                    >
                      {t('photos_label', { count: imageCount })}
                    </Chip>
                    {videoCount > 0 && (
                      <Chip
                        variant='flat'
                        className='border border-gray-300 bg-gray-200 text-gray-700'
                        startContent={<Play className='h-3 w-3' />}
                      >
                        {t('videos_chip_label', { count: videoCount })}
                      </Chip>
                    )}
                  </div>
                </div>

                {/* Main Swiper */}
                <div className='h-[600px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-lg'>
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs, EffectFade, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    effect='fade'
                    navigation={{
                      nextEl: '.custom-next',
                      prevEl: '.custom-prev',
                    }}
                    pagination={{
                      clickable: true,
                      bulletClass: 'swiper-pagination-bullet !bg-white/70 !w-4 !h-4 !mx-1',
                      bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125',
                    }}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    className='group h-full w-full'
                  >
                    {project.media!.map((media, index) => (
                      <SwiperSlide key={media.id}>
                        <div className='relative h-full w-full'>
                          {media.type === 'image' ? (
                            <>
                              <Image
                                src={media.url || '/placeholder.svg'}
                                alt={media.name}
                                fill
                                className='object-cover transition-transform duration-700 group-hover:scale-105'
                                sizes='1200px'
                                priority={index === 0}
                              />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
                              <div className='absolute bottom-6 left-6 text-white'>
                                <p className='text-xl font-bold drop-shadow-lg'>{media.name}</p>
                                <p className='text-sm opacity-90'>
                                  {t('slide_counter', { current: index + 1, total: project.media!.length })}
                                </p>
                              </div>
                            </>
                          ) : (
                            <video
                              src={media.url}
                              className='h-full w-full object-cover'
                              controls
                              preload='metadata'
                              poster='/images/logo.png'
                            />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}

                    {/* Professional Navigation */}
                    <div className='custom-prev absolute left-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100'>
                      <ArrowLeftIcon className='h-6 w-6 text-gray-700' />
                    </div>
                    <div className='custom-next absolute right-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 rotate-180 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100'>
                      <ArrowLeftIcon className='h-6 w-6 text-gray-700' />
                    </div>
                  </Swiper>
                </div>

                {/* Professional Thumbnails */}
                {project.media!.length > 1 && (
                  <div className='h-28 w-full'>
                    <Swiper
                      modules={[Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={16}
                      slidesPerView={8}
                      watchSlidesProgress
                      className='h-full w-full'
                      breakpoints={{
                        320: { slidesPerView: 3, spaceBetween: 8 },
                        640: { slidesPerView: 4, spaceBetween: 12 },
                        768: { slidesPerView: 6, spaceBetween: 14 },
                        1024: { slidesPerView: 8, spaceBetween: 16 },
                        1280: { slidesPerView: 10, spaceBetween: 16 },
                      }}
                    >
                      {project.media!.map((media) => (
                        <SwiperSlide key={`thumb-${media.id}`}>
                          <div className='relative h-full w-full cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 transition-all duration-300 hover:border-gray-400 hover:shadow-md'>
                            <Image
                              src={media.url || '/placeholder.svg'}
                              alt={media.name}
                              fill
                              className='object-cover transition-transform duration-300 hover:scale-110'
                              sizes='120px'
                            />
                            {media.type === 'video' && (
                              <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-lg'>
                                  <Play className='h-4 w-4 fill-current text-gray-800' />
                                </div>
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Professional Description */}
            <Card className='border border-gray-200 shadow-lg'>
              <CardBody className='p-8'>
                {project.description ? (
                  <div className='prose prose-lg prose-gray max-w-none'>
                    <p className='whitespace-pre-wrap text-lg leading-relaxed text-gray-700'>{project.description}</p>
                  </div>
                ) : (
                  <div className='py-12 text-center'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                      <Edit3 className='h-8 w-8 text-gray-400' />
                    </div>
                    <h3 className='mb-2 text-xl font-semibold text-gray-600'>{t('no_description_title')}</h3>
                    <p className='text-gray-500'>{t('no_description_subtitle')}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Professional Sidebar */}
          <div className='space-y-6'>
            {/* Project Information */}
            <Card className='border border-gray-200 shadow-lg'>
              <CardHeader className='border-b border-gray-200 bg-gray-50 p-6'>
                <h2 className='text-xl font-bold text-gray-900'>{t('details_title')}</h2>
              </CardHeader>
              <CardBody className='space-y-4 p-6'>
                {/* Company */}
                <div className='flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 shadow-sm'>
                    <Building2 className='h-6 w-6 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs font-bold uppercase tracking-wider text-gray-500'>{t('company_label')}</p>
                    <p className='text-lg font-bold text-gray-900'>{project.companyName}</p>
                  </div>
                </div>

                {/* Location */}
                {project.location && (
                  <div className='hover:bg-gray-150 flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-100 p-4 transition-all'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-300 shadow-sm'>
                      <MapPin className='h-6 w-6 text-gray-600' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs font-bold uppercase tracking-wider text-gray-500'>{t('location_label')}</p>
                      <p className='text-lg font-bold text-gray-900'>{project.location}</p>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                <div className='hover:bg-gray-150 flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-100 p-4 transition-all'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-300 shadow-sm'>
                    <Factory className='h-6 w-6 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs font-bold uppercase tracking-wider text-gray-500'>{t('capacity_label')}</p>
                    <p className='text-lg font-bold text-gray-900'>{project.capacity}</p>
                  </div>
                </div>

                {/* Completion Time */}
                <div className='flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 shadow-sm'>
                    <Clock className='h-6 w-6 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs font-bold uppercase tracking-wider text-gray-500'>
                      {t('completion_time_label')}
                    </p>
                    <p className='text-lg font-bold text-gray-900'>{project.time}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Professional Media Statistics */}
            {hasMedia && (
              <Card className='border border-gray-200 shadow-lg'>
                <CardHeader className='border-b border-gray-200 bg-gray-50 p-6'>
                  <h2 className='text-xl font-bold text-gray-900'>{t('media_stats_title')}</h2>
                </CardHeader>
                <CardBody className='p-6'>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='rounded-xl border border-gray-200 bg-gray-100 p-6 text-center'>
                      <p className='text-3xl font-bold text-gray-900'>{project.media!.length}</p>
                      <p className='text-sm font-semibold text-gray-600'>{t('total_files_label')}</p>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='rounded-xl border border-gray-200 bg-gray-50 p-4 text-center'>
                        <p className='text-2xl font-bold text-gray-800'>{imageCount}</p>
                        <p className='text-xs font-semibold text-gray-600'>{t('images_label')}</p>
                      </div>
                      <div className='rounded-xl border border-gray-200 bg-gray-100 p-4 text-center'>
                        <p className='text-2xl font-bold text-gray-800'>{videoCount}</p>
                        <p className='text-xs font-semibold text-gray-600'>{t('videos_label')}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
