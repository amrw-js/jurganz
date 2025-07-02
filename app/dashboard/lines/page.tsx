'use client'

import { Button, Chip, Input } from '@heroui/react'
import { Calendar, DollarSign, Factory, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { ProductionLineList } from '@/app/components/dashboard/productionLine/ProductionLineList'
import { useProductionLines } from '@/app/hooks/useProductionLines'
import { ProductionLineModal } from '@/app/modals/ProductionLineModal'
import type { ProductionLineFormData } from '@/types/production-line.types'

export default function ProductionLinesPage() {
  const { productionLines, loading, addProductionLine, updateProductionLine, deleteProductionLine } =
    useProductionLines()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  console.log('Production Lines:', productionLines)

  const filteredProductionLines = productionLines.filter(
    (line) =>
      line.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.containerType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProductionLine = async (data: ProductionLineFormData) => {
    try {
      await addProductionLine(data)
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to create production line:', error)
    }
  }

  const handleUpdateProductionLine = async (id: string, data: ProductionLineFormData) => {
    try {
      await updateProductionLine(id, data)
    } catch (error) {
      console.error('Failed to update production line:', error)
    }
  }

  const handleDeleteProductionLine = async (id: string) => {
    try {
      deleteProductionLine(id)
    } catch (error) {
      console.error('Failed to delete production line:', error)
    }
  }

  // Calculate stats
  const totalValue = productionLines.reduce((acc, line) => acc + line.price, 0)
  const availableLines = productionLines.filter((line) => line.isAvailableNow).length
  const publishedLines = productionLines.filter((line) => line.published).length // Add this line
  const averageYear =
    productionLines.length > 0
      ? Math.round(productionLines.reduce((acc, line) => acc + line.yearOfManufacturing, 0) / productionLines.length)
      : new Date().getFullYear()

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-2 flex items-center gap-3'>
          <div className='rounded-lg bg-warning/10 p-2'>
            <Factory className='h-6 w-6 text-warning' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>Production Lines</h1>
            <p className='text-default-500'>Manage production workflows and processes</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Total Production Lines</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{productionLines.length}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
              <Factory className='h-6 w-6 text-primary' />
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Available Now</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{availableLines}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-success/10'>
              <Calendar className='h-6 w-6 text-success' />
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-default-600'>Published</p>
              <p className='mt-2 text-3xl font-bold text-foreground'>{publishedLines}</p>
            </div>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10'>
              <DollarSign className='h-6 w-6 text-secondary' />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className='mb-8 rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='relative max-w-md flex-1'>
            <Input
              placeholder='Search production lines...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className='h-4 w-4 text-default-400' />}
              variant='bordered'
              className='w-full'
            />
          </div>

          <div className='flex items-center gap-4'>
            <Button
              color='primary'
              startContent={<Plus className='h-4 w-4' />}
              onPress={() => setIsAddModalOpen(true)}
              className='gap-2'
            >
              Add Production Line
            </Button>
          </div>
        </div>
      </div>

      {/* Production Lines List Container */}
      <div className='rounded-xl border border-default-200 bg-content1 p-6 shadow-sm'>
        <ProductionLineList
          productionLines={filteredProductionLines}
          loading={loading}
          searchTerm={searchTerm}
          onUpdate={handleUpdateProductionLine}
          onDelete={handleDeleteProductionLine}
          onCreateNew={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Add Production Line Modal */}
      <ProductionLineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProductionLine}
      />
    </div>
  )
}
