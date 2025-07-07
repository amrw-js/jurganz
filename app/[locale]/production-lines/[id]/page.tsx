'use client'

import { Button, Card, CardBody, Chip } from '@heroui/react'
import { ArrowLeftIcon, Calendar, Camera, Clock, Container, Factory, Mail, Play, Settings, Zap } from 'lucide-react'
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

import { ContactModal } from '@/app/components/ContactModal'
import { useProductionLine } from '@/app/hooks/useProductionLines'

// Import Swiper styles
import 'swiper/css'

export default function ProductionLineDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const { data: productionLine, isLoading, error } = useProductionLine(id as string)

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='flex flex-col items-center gap-8'>
          <div className='relative'>
            <div className='h-20 w-20 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Factory className='h-8 w-8 text-gray-600' />
            </div>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-semibold text-gray-800'>{t('line:loading_production_line')}</p>
            <p className='mt-2 text-gray-600'>{t('line:please_wait_fetch_info')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !productionLine) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Card className='border border-gray-200 shadow-xl'>
          <CardBody className='p-12 text-center'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100'>
              <ArrowLeftIcon className='h-10 w-10 text-gray-600' />
            </div>
            <h3 className='mb-4 text-3xl font-bold text-gray-800'>{t('line:production_line_not_found')}</h3>
            <p className='mb-8 text-lg leading-relaxed text-gray-600'>
              {t('line:production_line_not_found_description')}
            </p>
            <Button
              as={Link}
              href='/production-lines'
              color='default'
              size='lg'
              className='w-full bg-gray-900 font-semibold text-white hover:bg-gray-800'
            >
              {t('line:back_to_production_lines')}
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  const hasMedia = productionLine.media && productionLine.media.length > 0
  const imageCount = productionLine.media?.filter((m) => m.type === 'image').length || 0
  const videoCount = productionLine.media?.filter((m) => m.type === 'video').length || 0

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Clean Header */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='mx-auto px-6 py-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-6'>
              <Button as={Link} href='/production-lines' isIconOnly variant='light' className='hover:bg-gray-100'>
                <ArrowLeftIcon className='h-5 w-5 text-gray-600' />
              </Button>

              <div>
                <div className='mb-2 flex items-center gap-4'>
                  <h1 className='text-3xl font-bold text-gray-900 lg:text-4xl'>
                    {productionLine.productType} {t('line:production_line')}
                  </h1>
                  <Chip
                    variant='flat'
                    size='md'
                    className={`${
                      productionLine.isAvailableNow
                        ? 'border border-green-200 bg-green-50 text-green-700'
                        : 'border border-orange-200 bg-orange-50 text-orange-700'
                    }`}
                  >
                    {productionLine.isAvailableNow ? t('line:available_now') : t('line:coming_soon')}
                  </Chip>
                </div>
              </div>
            </div>

            <Button
              color='primary'
              startContent={<Mail className='h-4 w-4' />}
              onPress={() => setIsContactModalOpen(true)}
            >
              {t('line:get_in_touch')}
            </Button>
          </div>
        </div>
      </div>

      <div className='mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
          {/* Media Gallery */}
          <div className='lg:col-span-2'>
            {hasMedia ? (
              <div className='space-y-6'>
                {/* Main Image */}
                <div className='h-[500px] w-full overflow-hidden rounded-2xl'>
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
                      bulletClass: 'swiper-pagination-bullet !bg-gray-400 !w-3 !h-3 !mx-1',
                      bulletActiveClass: 'swiper-pagination-bullet-active !bg-gray-700 !scale-125',
                    }}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    className='group h-full w-full'
                  >
                    {productionLine.media!.map((media, index) => (
                      <SwiperSlide key={media.id}>
                        <div className='relative h-full w-full'>
                          {media.type === 'image' ? (
                            <Image
                              src={media.url || '/placeholder.svg'}
                              alt={media.name}
                              fill
                              className='object-cover'
                              sizes='800px'
                              priority={index === 0}
                            />
                          ) : (
                            <video src={media.url} className='h-full w-full object-cover' controls preload='metadata' />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}

                    {/* Navigation */}
                    <div className='custom-prev absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100'>
                      <ArrowLeftIcon className='h-5 w-5 text-gray-700' />
                    </div>
                    <div className='custom-next absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 rotate-180 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100'>
                      <ArrowLeftIcon className='h-5 w-5 text-gray-700' />
                    </div>
                  </Swiper>
                </div>

                {/* Thumbnails */}
                {productionLine.media!.length > 1 && (
                  <div className='h-24 w-full'>
                    <Swiper
                      modules={[Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={12}
                      slidesPerView={6}
                      watchSlidesProgress
                      className='h-full w-full'
                      breakpoints={{
                        320: { slidesPerView: 3, spaceBetween: 8 },
                        640: { slidesPerView: 4, spaceBetween: 10 },
                        768: { slidesPerView: 5, spaceBetween: 12 },
                        1024: { slidesPerView: 6, spaceBetween: 12 },
                      }}
                    >
                      {productionLine.media!.map((media) => (
                        <SwiperSlide key={`thumb-${media.id}`}>
                          <div className='relative h-full w-full cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 transition-all duration-300 hover:border-gray-400'>
                            <Image
                              src={media.url || '/placeholder.svg'}
                              alt={media.name}
                              fill
                              className='object-cover'
                              sizes='100px'
                            />
                            {media.type === 'video' && (
                              <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-white/90'>
                                  <Play className='h-3 w-3 fill-current text-gray-800' />
                                </div>
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}

                {/* Media Stats */}
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <div className='flex items-center gap-2'>
                    <Camera className='h-4 w-4' />
                    <span>
                      {imageCount} {t('line:photos')}
                    </span>
                  </div>
                  {videoCount > 0 && (
                    <>
                      <span>•</span>
                      <div className='flex items-center gap-2'>
                        <Play className='h-4 w-4' />
                        <span>
                          {videoCount} {t('line:videos')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className='flex h-[500px] items-center justify-center rounded-2xl bg-gray-100'>
                <div className='text-center'>
                  <Factory className='mx-auto h-16 w-16 text-gray-400' />
                  <p className='mt-4 text-gray-500'>{t('line:no_images_available')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Specifications Sidebar */}
          <div className='space-y-8'>
            {/* Quick Specs */}
            <Card className='border border-gray-200'>
              <CardBody className='p-6'>
                <h3 className='mb-6 text-lg font-semibold text-gray-900'>{t('line:specifications')}</h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Container className='h-4 w-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>{t('line:container')}</span>
                    </div>
                    <span className='font-semibold text-gray-900'>{productionLine.containerType}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Zap className='h-4 w-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>{t('line:capacity')}</span>
                    </div>
                    <span className='font-semibold text-gray-900'>{productionLine.capacity}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>{t('line:year')}</span>
                    </div>
                    <span className='font-semibold text-gray-900'>{productionLine.yearOfManufacturing}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Settings className='h-4 w-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>{t('line:process')}</span>
                    </div>
                    <span className='font-semibold text-gray-900'>{productionLine.fillingProcess}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Factory className='h-4 w-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>{t('line:type')}</span>
                    </div>
                    <span className='font-semibold text-gray-900'>{productionLine.fillingType}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>{t('line:working_time')}</span>
                    </div>
                    <span className='font-semibold text-gray-900'>{productionLine.approximateWorkingTime}</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Technical Details */}
            <Card className='border border-gray-200'>
              <CardBody className='p-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>{t('line:technical_details')}</h3>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>{t('line:control_plc')}</p>
                    <p className='text-gray-900'>{productionLine.controlPLC}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>{t('line:line_machines')}</p>
                    <p className='text-gray-900'>{productionLine.lineMachines}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Contact CTA */}
            <Card className='border border-gray-900 bg-gray-900'>
              <CardBody className='p-6 text-center'>
                <h3 className='mb-2 text-lg font-semibold text-white'>{t('line:interested_in_this_line')}</h3>
                <p className='mb-4 text-sm text-gray-300'>{t('line:interested_in_this_line_description')}</p>
                <Button
                  className='w-full bg-white font-semibold text-gray-900 hover:bg-gray-100'
                  startContent={<Mail className='h-4 w-4' />}
                  onPress={() => setIsContactModalOpen(true)}
                >
                  {t('line:get_in_touch')}
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        productionLine={productionLine}
      />
    </div>
  )
}
