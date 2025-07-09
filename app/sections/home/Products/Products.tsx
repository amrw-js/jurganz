'use client'

import { Button } from '@heroui/react'
import { type MotionProps, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { type FC, type HTMLAttributes, useCallback, useState } from 'react'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { ContactModal } from '@/app/components/ContactModal'
import { useProductionLines } from '@/app/hooks/useProductionLines'
import { useTranslations } from '@/app/hooks/useTranslations'
import { ProductionLine } from '@/types/production-line.types'

import 'swiper/css'

export const Products: FC = () => {
  const { t } = useTranslations()
  const { data: productionLines, isLoading } = useProductionLines()

  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductionLine | null>(null)

  const MotionDiv = motion.div as FC<HTMLAttributes<HTMLDivElement> & MotionProps>
  const MotionH3 = motion.h3 as FC<HTMLAttributes<HTMLHeadingElement> & MotionProps>
  const MotionP = motion.p as FC<HTMLAttributes<HTMLParagraphElement> & MotionProps>

  const filteredProductionLines = productionLines?.filter((product) => product.published)

  const handleContactClick = useCallback((product: ProductionLine) => {
    setSelectedProduct(product)
    setIsContactModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsContactModalOpen(false)
    setSelectedProduct(null)
  }, [])

  const renderProductCard = useCallback(
    (product: ProductionLine) => {
      return (
        <MotionDiv
          className='group relative h-full w-full transform overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className='relative h-56 overflow-hidden'>
            <Image
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
              src={product.media?.[0]?.url || '/images/welding.webp'}
              width={500}
              height={300}
              alt={product.productType}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

            {!product.isAvailableNow && (
              <div className='absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white'>
                {t('not_available')}
              </div>
            )}
            {product.negotiable && product.isAvailableNow && (
              <div className='absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white'>
                {t('available')}
              </div>
            )}
          </div>

          <div className='p-6'>
            <div className='mb-4'>
              <h3 className='mb-2 line-clamp-2 text-xl font-bold text-gray-900'>{product.productType}</h3>
              <p className='mb-3 text-sm font-medium text-gray-600'>{product.companyName}</p>
            </div>

            <div className='mb-4 space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>{t('container_type')}:</span>
                <span className='font-medium text-gray-700'>{product.containerType}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>{t('capacity')}:</span>
                <span className='font-medium text-gray-700'>{product.capacity}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>{t('year')}:</span>
                <span className='font-medium text-gray-700'>{product.yearOfManufacturing}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>{t('process')}:</span>
                <span className='font-medium text-gray-700'>{product.fillingProcess}</span>
              </div>
            </div>

            {!product.isAvailableNow && product.expectedAvailableDate && (
              <div className='mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3'>
                <p className='text-sm text-orange-700'>
                  <span className='font-medium'>{t('expected_available')}:</span>{' '}
                  {new Date(product.expectedAvailableDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className='flex gap-3'>
              <Button
                as={Link}
                href={`/production-lines/${product.id}`}
                className='flex-1 border-2 hover:bg-gray-50'
                variant='light'
              >
                {t('more_details')}
              </Button>
              <Button color='primary' className='flex-1' onPress={() => handleContactClick(product)}>
                {t('contact_us')}
              </Button>
            </div>
          </div>
        </MotionDiv>
      )
    },
    [t, handleContactClick],
  )

  const renderLoadingSkeleton = useCallback(() => {
    return (
      <MotionDiv
        className='h-full w-full animate-pulse overflow-hidden rounded-2xl bg-white shadow-lg'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div className='h-56 bg-gray-200'></div>
        <div className='p-6'>
          <div className='mb-4'>
            <div className='mb-2 h-6 w-3/4 rounded bg-gray-200'></div>
            <div className='mb-3 h-4 w-1/2 rounded bg-gray-200'></div>
          </div>
          <div className='mb-4 space-y-2'>
            <div className='flex justify-between'>
              <div className='h-3 w-1/3 rounded bg-gray-200'></div>
              <div className='h-3 w-1/4 rounded bg-gray-200'></div>
            </div>
            <div className='flex justify-between'>
              <div className='h-3 w-1/4 rounded bg-gray-200'></div>
              <div className='h-3 w-1/3 rounded bg-gray-200'></div>
            </div>
            <div className='flex justify-between'>
              <div className='h-3 w-1/5 rounded bg-gray-200'></div>
              <div className='h-3 w-1/6 rounded bg-gray-200'></div>
            </div>
            <div className='flex justify-between'>
              <div className='h-3 w-1/3 rounded bg-gray-200'></div>
              <div className='h-3 w-1/4 rounded bg-gray-200'></div>
            </div>
          </div>
          <div className='flex gap-3'>
            <div className='h-10 flex-1 rounded bg-gray-200'></div>
            <div className='h-10 flex-1 rounded bg-gray-200'></div>
          </div>
        </div>
      </MotionDiv>
    )
  }, [])

  return (
    <div className='relative bg-factory bg-cover bg-fixed bg-center bg-no-repeat px-[0.875rem] py-10 text-center text-white sm:px-10 lg:py-[7.75rem]'>
      <div className='absolute inset-0 z-0 h-full w-full bg-black/70'></div>

      <div className='relative z-10 mb-10 lg:mb-20'>
        <MotionH3
          className='text-2xl font-semibold leading-8 sm:text-4xl sm:leading-10'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeInOut' }}
        >
          {t('products_heading')}
        </MotionH3>
        <MotionP
          className='text-sm font-medium leading-5 sm:text-lg sm:leading-7'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeInOut' }}
        >
          {t('products_desc')}
        </MotionP>
      </div>

      <div className='relative z-10'>
        <div className='mb-8 flex justify-center'>
          <Link
            href='/production-lines'
            className='text-lg font-semibold text-white underline transition-colors hover:text-gray-300'
          >
            {t('see_all_production_lines')}
          </Link>
        </div>

        <div className='products-swiper'>
          {isLoading ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
                1280: { slidesPerView: 4, spaceBetween: 32 },
              }}
              className='!pb-12'
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`} className='h-auto'>
                  {renderLoadingSkeleton()}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : filteredProductionLines && filteredProductionLines.length > 0 ? (
            <>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-products',
                  prevEl: '.swiper-button-prev-products',
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet-products',
                  bulletActiveClass: 'swiper-pagination-bullet-active-products',
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 28 },
                  1280: { slidesPerView: 4, spaceBetween: 32 },
                }}
                className='!pb-12'
              >
                {filteredProductionLines.map((product) => (
                  <SwiperSlide key={product.id} className='h-auto'>
                    {renderProductCard(product)}
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className='mt-6 flex justify-center gap-4'>
                <button className='swiper-button-prev-products flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-black'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='m15 18-6-6 6-6' />
                  </svg>
                </button>
                <button className='swiper-button-next-products flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-black'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='m9 18 6-6-6-6' />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20'>
                <svg className='h-8 w-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                  />
                </svg>
              </div>
              <p className='mb-2 text-lg font-medium text-white'>{t('no_products_found')}</p>
              <p className='text-gray-300'>{t('no_products_hint')}</p>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ContactModal isOpen={isContactModalOpen} onClose={handleCloseModal} productionLine={selectedProduct} />
      )}
    </div>
  )
}
