'use client'

import { Button } from '@heroui/react'
import { Factory, Plus, Search } from 'lucide-react'

import { ProductionLineCard } from '@/app/components/ProductionLineCard'
import { useProductionLines } from '@/app/hooks/useProductionLines'

export default function ProductionLinesPage() {
  const { data: productionLines = [], isLoading, error } = useProductionLines()

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
            <p className='text-2xl font-semibold text-gray-800'>Loading production lines...</p>
            <p className='mt-2 text-gray-600'>Please wait while we fetch the information</p>
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
          <h3 className='mt-4 text-2xl font-bold text-gray-800'>Error Loading Production Lines</h3>
          <p className='mt-2 text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Clean Header */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-6xl px-6 py-12'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 lg:text-5xl'>Production Lines</h1>
            <p className='mt-4 text-xl text-gray-600'>Find the perfect production line for your business</p>
            <div className='mt-8 flex items-center justify-center gap-4'>
              <Button color='primary' startContent={<Plus className='h-4 w-4' />}>
                List Your Line
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Production Lines */}
      <div className='mx-auto max-w-6xl px-6 py-12'>
        {productionLines.length > 0 ? (
          <div className='space-y-8'>
            {productionLines.map((productionLine, index) => (
              <ProductionLineCard
                key={productionLine.id}
                productionLine={productionLine}
                showDivider={index < productionLines.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
              <Factory className='mx-auto h-16 w-16 text-gray-400' />
              <h3 className='mt-4 text-xl font-semibold text-gray-800'>No Production Lines Found</h3>
              <p className='mt-2 text-gray-600'>Be the first to list a production line</p>
              <Button
                className='mt-6 bg-gray-900 text-white hover:bg-gray-800'
                startContent={<Plus className='h-4 w-4' />}
              >
                List Your Line
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
