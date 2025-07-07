'use client'

import { Button } from '@heroui/react'
import { Factory, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ProductionLineCard } from '@/app/components/ProductionLineCard'
import { useCreateProductionLine, useProductionLines } from '@/app/hooks/useProductionLines'
import ProductionLineModal from '@/app/modals/SellProductionLineModal'
import { CreateProductionLine } from '@/types/production-line.types'

export default function ProductionLinesPage() {
  const { t } = useTranslation()
  const { data: productionLines = [], isLoading, error } = useProductionLines()
  const { mutate: createLine, isPending: isPending } = useCreateProductionLine()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateLine = (formData: CreateProductionLine) => {
    createLine({ ...formData, published: false })
  }

  const filteredLines = productionLines.filter((line) => line.published)

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
            <p className='text-2xl font-semibold text-gray-800'>{t('lines:loading_production_lines')}</p>
            <p className='mt-2 text-gray-600'>{t('lines:please_wait_fetch_info')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Factory className='mx-auto h-16 w-16 text-gray-400' />
          <h3 className='mt-4 text-2xl font-bold text-gray-800'>{t('lines:error_loading_production_lines')}</h3>
          <p className='mt-2 text-gray-600'>{t('lines:please_try_again_later')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Clean Header */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='mx-auto px-6 py-12'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 lg:text-5xl'>{t('lines:production_lines')}</h1>
            <p className='mt-4 text-xl text-gray-600'>{t('lines:find_perfect_production_line')}</p>
            <div className='mt-8 flex items-center justify-center gap-4'>
              <Button onPress={() => setIsModalOpen(true)} color='primary' startContent={<Plus className='h-4 w-4' />}>
                {t('lines:list_your_line')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Production Lines */}
      <div className='mx-auto px-6 py-12'>
        {filteredLines.length > 0 ? (
          <div className='space-y-8'>
            {filteredLines.map((productionLine, index) => (
              <ProductionLineCard
                key={productionLine.id}
                productionLine={productionLine}
                showDivider={index < filteredLines.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
              <Factory className='mx-auto h-16 w-16 text-gray-400' />
              <h3 className='mt-4 text-xl font-semibold text-gray-800'>{t('lines:no_production_lines_found')}</h3>
              <p className='mt-2 text-gray-600'>{t('lines:be_first_to_list')}</p>
              <Button
                className='mt-6 bg-gray-900 text-white hover:bg-gray-800'
                startContent={<Plus className='h-4 w-4' />}
              >
                {t('lines:list_your_line')}
              </Button>
            </div>
          </div>
        )}
      </div>
      <ProductionLineModal
        isOpen={isModalOpen}
        isPending={isPending}
        onSubmit={handleCreateLine}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
