'use client'

import { Chip, Divider } from '@heroui/react'
import { ArrowUpRight, Calendar, Clock, Container, Factory, Settings, Zap } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { ProductionLine } from '@/types/production-line.types'

// Import Swiper styles
import 'swiper/css'

interface ProductionLineCardProps {
  productionLine: ProductionLine
  showDivider?: boolean
}

export const ProductionLineCard = ({ productionLine, showDivider = true }: ProductionLineCardProps) => {
  const router = useRouter()
  const { t } = useTranslation(['default', 'line'])
  const hasMedia = productionLine.media && productionLine.media.length > 0

  const handleProductionLineClick = () => {
    router.push(`/production-lines/${productionLine.id}`)
  }

  return (
    <>
      <div
        className='group cursor-pointer rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg'
        onClick={handleProductionLineClick}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleProductionLineClick()
          }
        }}
      >
        <div className='flex flex-col gap-8 lg:flex-row lg:gap-12'>
          {/* Media Section */}
          <div className='relative h-[240px] w-full shrink-0 lg:h-[320px] lg:w-[480px]'>
            {hasMedia ? (
              <div className='h-full w-full overflow-hidden rounded-2xl'>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-gray-400 !w-2 !h-2 !mx-1',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-gray-700 !scale-125',
                  }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  className='h-full w-full'
                >
                  {productionLine.media!.map((media) => (
                    <SwiperSlide key={media.id}>
                      {media.type === 'image' ? (
                        <div className='relative h-full w-full'>
                          <Image
                            src={media.url || '/placeholder.svg'}
                            alt={t('line:production_line_image_alt', { productType: productionLine.productType })}
                            fill
                            className='object-cover'
                            sizes='(max-width: 1024px) 100vw, 480px'
                          />
                        </div>
                      ) : (
                        <video
                          src={media.url}
                          className='h-full w-full object-cover'
                          controls
                          preload='metadata'
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className='flex h-full w-full items-center justify-center rounded-2xl bg-gray-100'>
                <div className='text-center'>
                  <Factory className='mx-auto h-16 w-16 text-gray-400' />
                  <p className='mt-4 text-sm text-gray-500'>{t('line:no_images_available')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className='flex flex-1 flex-col justify-between'>
            {/* Header */}
            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex items-start justify-between'>
                  <h2 className='text-3xl font-bold text-gray-900 lg:text-4xl'>
                    {t('line:production_line_title', { productType: productionLine.productType })}
                  </h2>
                  <ArrowUpRight className='h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-600' />
                </div>

                <div className='flex items-center gap-3'>
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
                  {productionLine.negotiable && (
                    <Chip variant='flat' size='md' className='border border-blue-200 bg-blue-50 text-blue-700'>
                      {t('line:negotiable')}
                    </Chip>
                  )}
                </div>
              </div>

              {/* Specifications Grid */}
              <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Container className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium text-gray-500'>{t('line:container')}</span>
                  </div>
                  <p className='font-semibold text-gray-900'>{productionLine.containerType}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Zap className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium text-gray-500'>{t('line:capacity')}</span>
                  </div>
                  <p className='font-semibold text-gray-900'>{productionLine.capacity}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium text-gray-500'>{t('line:year')}</span>
                  </div>
                  <p className='font-semibold text-gray-900'>{productionLine.yearOfManufacturing}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Settings className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium text-gray-500'>{t('line:process')}</span>
                  </div>
                  <p className='font-semibold text-gray-900'>{productionLine.fillingProcess}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Factory className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium text-gray-500'>{t('line:type')}</span>
                  </div>
                  <p className='font-semibold text-gray-900'>{productionLine.fillingType}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium text-gray-500'>{t('line:working_time')}</span>
                  </div>
                  <p className='font-semibold text-gray-900'>{productionLine.approximateWorkingTime}</p>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className='mt-8 flex items-center justify-between border-t border-gray-100 pt-6'>
              <div className='flex items-center gap-6 text-sm text-gray-500'>
                <span>
                  {t('line:id_label')}: {productionLine.id.slice(0, 8)}
                </span>
                <span>•</span>
                <span>
                  {t('line:plc_label')}: {productionLine.controlPLC}
                </span>
                {hasMedia && (
                  <>
                    <span>•</span>
                    <span>{t('line:photos_count', { count: productionLine.media!.length })}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDivider && <Divider className='my-12' />}
    </>
  )
}
