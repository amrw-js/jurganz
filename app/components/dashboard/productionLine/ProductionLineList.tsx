'use client'

import { Button, Spinner } from '@heroui/react'
import { Plus } from 'lucide-react'

import type { ProductionLine, ProductionLineFormData } from '@/types/production-line.types'

import { ProductionLineCard } from './ProductionLineCard'

interface ProductionLineListProps {
  productionLines: ProductionLine[]
  loading: boolean
  searchTerm: string
  onUpdate: (id: string, data: ProductionLineFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onCreateNew: () => void
}

export function ProductionLineList({
  productionLines,
  loading,
  searchTerm,
  onUpdate,
  onDelete,
  onCreateNew,
}: ProductionLineListProps) {
  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Spinner size='lg' color='primary' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-foreground'>
            {searchTerm
              ? `Search Results (${productionLines.length})`
              : `All Production Lines (${productionLines.length})`}
          </h2>
          <p className='text-sm text-default-500'>
            {searchTerm
              ? `Showing production lines matching "${searchTerm}"`
              : 'Manage your production lines and equipment'}
          </p>
        </div>
      </div>

      {/* Production Lines Grid */}
      {productionLines.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {productionLines.map((productionLine) => (
            <ProductionLineCard
              key={productionLine.id}
              productionLine={productionLine}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className='py-12 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-default-100'>
            <Plus className='h-8 w-8 text-default-400' />
          </div>
          <h3 className='mb-2 text-lg font-medium text-foreground'>
            {searchTerm ? 'No production lines found' : 'No production lines yet'}
          </h3>
          <p className='mb-6 text-sm text-default-500'>
            {searchTerm
              ? `No production lines match "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first production line with detailed specifications.'}
          </p>
          <Button color='primary' variant='flat' startContent={<Plus className='h-4 w-4' />} onPress={onCreateNew}>
            {searchTerm ? 'Add New Production Line' : 'Add Your First Production Line'}
          </Button>
        </div>
      )}
    </div>
  )
}
