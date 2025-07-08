'use client'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@heroui/react'
import { Edit, Globe, Languages, Save, Search, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { useLocales, useUpdateLocale } from '@/app/hooks/useLocales'
import type { Locale, UpdateLocale } from '@/types/locales.types'

// Status filter options
const statusOptions = [
  { key: 'all', label: 'All Status' },
  { key: 'complete', label: 'Complete' },
  { key: 'partial', label: 'Partial' },
  { key: 'missing', label: 'Missing' },
]

// Items per page options
const itemsPerPageOptions = [
  { key: '10', label: '10' },
  { key: '25', label: '25' },
  { key: '50', label: '50' },
  { key: '100', label: '100' },
]

export default function TranslationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ en?: string; ar?: string }>({})

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null)

  // Fetch locales
  const { data: locales, isLoading, error } = useLocales()
  const updateLocaleMutation = useUpdateLocale()

  // Memoized filtered and paginated data
  const { filteredLocales, paginatedLocales, totalPages, stats } = useMemo(() => {
    if (!locales)
      return {
        filteredLocales: [],
        paginatedLocales: [],
        totalPages: 0,
        stats: { total: 0, complete: 0, partial: 0, missing: 0 },
      }

    // Filter by search query
    let filtered = locales.filter(
      (locale) =>
        locale.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        locale.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        locale.ar?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((locale) => {
        const hasEn = !!locale.en
        const hasAr = !!locale.ar

        switch (statusFilter) {
          case 'complete':
            return hasEn && hasAr
          case 'partial':
            return (hasEn && !hasAr) || (!hasEn && hasAr)
          case 'missing':
            return !hasEn && !hasAr
          default:
            return true
        }
      })
    }

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginated = filtered.slice(startIndex, endIndex)

    // Calculate stats
    const stats = {
      total: locales.length,
      complete: locales.filter((l) => l.en && l.ar).length,
      partial: locales.filter((l) => (l.en && !l.ar) || (!l.en && l.ar)).length,
      missing: locales.filter((l) => !l.en && !l.ar).length,
    }

    return {
      filteredLocales: filtered,
      paginatedLocales: paginated,
      totalPages,
      stats,
    }
  }, [locales, searchQuery, statusFilter, currentPage, itemsPerPage])

  // Reset to first page when filters change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }, [])

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }, [])

  const handleEdit = useCallback((locale: Locale) => {
    setEditingKey(locale.key)
    setEditValues({
      en: locale.en || '',
      ar: locale.ar || '',
    })
  }, [])

  const handleSave = useCallback(
    async (key: string) => {
      try {
        const updateData: UpdateLocale = {
          en: editValues.en || undefined,
          ar: editValues.ar || undefined,
        }

        await updateLocaleMutation.mutateAsync({ key, data: updateData })
        setEditingKey(null)
        setEditValues({})
      } catch (error) {
        console.error('Failed to update locale:', error)
      }
    },
    [editValues, updateLocaleMutation],
  )

  const handleCancel = useCallback(() => {
    setEditingKey(null)
    setEditValues({})
  }, [])

  const openDetailModal = useCallback(
    (locale: Locale) => {
      setSelectedLocale(locale)
      onOpen()
    },
    [onOpen],
  )

  const getStatusChip = useCallback((locale: Locale) => {
    const hasEn = !!locale.en
    const hasAr = !!locale.ar

    if (hasEn && hasAr) {
      return (
        <Chip size='sm' style={{ backgroundColor: '#155E75', color: 'white' }}>
          Complete
        </Chip>
      )
    } else if (hasEn || hasAr) {
      return (
        <Chip size='sm' color='warning' variant='flat'>
          Partial
        </Chip>
      )
    } else {
      return (
        <Chip size='sm' color='danger' variant='flat'>
          Missing
        </Chip>
      )
    }
  }, [])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size='lg' style={{ color: '#155E75' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Card>
          <CardBody className='text-center'>
            <p className='text-red-500'>Error loading translations: {error.message}</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-7xl p-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-2 flex items-center gap-3'>
          <div className='rounded-lg p-2' style={{ backgroundColor: '#155E75' }}>
            <Languages className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Translation Management</h1>
            <p className='text-gray-600'>Edit translation keys for English and Arabic languages</p>
          </div>
        </div>
      </div>

      {/* Search, Filters and Stats */}
      <Card className='mb-6'>
        <CardBody>
          <div className='flex flex-col gap-4'>
            {/* Search and Filters Row */}
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <div className='flex flex-1 gap-3'>
                <div className='max-w-md flex-1'>
                  <Input
                    placeholder='Search translations...'
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    startContent={<Search className='h-4 w-4 text-gray-400' />}
                    classNames={{
                      input: 'focus:ring-[#155E75]',
                      inputWrapper: 'focus-within:border-[#155E75]',
                    }}
                  />
                </div>
                <Select
                  placeholder='Filter by status'
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => handleStatusFilterChange(Array.from(keys)[0] as string)}
                  className='w-48'
                  classNames={{
                    trigger: 'focus:border-[#155E75]',
                  }}
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Items per page selector */}
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Items per page:</span>
                <Select
                  selectedKeys={[itemsPerPage.toString()]}
                  onSelectionChange={(keys) => handleItemsPerPageChange(Array.from(keys)[0] as string)}
                  className='w-20'
                  classNames={{
                    trigger: 'focus:border-[#155E75]',
                  }}
                >
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Stats Row */}
            <div className='flex justify-between'>
              <div className='flex gap-6 text-sm'>
                <div className='text-center'>
                  <div className='font-semibold text-gray-900'>{stats.total}</div>
                  <div className='text-gray-500'>Total Keys</div>
                </div>
                <div className='text-center'>
                  <div className='font-semibold' style={{ color: '#155E75' }}>
                    {stats.complete}
                  </div>
                  <div className='text-gray-500'>Complete</div>
                </div>
                <div className='text-center'>
                  <div className='font-semibold text-orange-600'>{stats.partial}</div>
                  <div className='text-gray-500'>Partial</div>
                </div>
                <div className='text-center'>
                  <div className='font-semibold text-red-600'>{stats.missing}</div>
                  <div className='text-gray-500'>Missing</div>
                </div>
              </div>

              {/* Results info */}
              <div className='text-sm text-gray-600'>
                Showing {filteredLocales.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredLocales.length)} of {filteredLocales.length} results
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Translations Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Translation Keys</h2>
            {filteredLocales.length === 0 && searchQuery && (
              <div className='text-sm text-gray-500'>No translations found for "{searchQuery}"</div>
            )}
          </div>
        </CardHeader>
        <CardBody className='p-0'>
          <Table aria-label='Translations table'>
            <TableHeader>
              <TableColumn>KEY</TableColumn>
              <TableColumn>ENGLISH</TableColumn>
              <TableColumn>ARABIC</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={searchQuery ? 'No translations found' : 'No translations available'}>
              {paginatedLocales.map((locale) => (
                <TableRow key={locale.key}>
                  <TableCell>
                    <div className='max-w-xs truncate font-mono text-sm text-gray-600'>{locale.key}</div>
                  </TableCell>
                  <TableCell>
                    {editingKey === locale.key ? (
                      <Input
                        value={editValues.en || ''}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, en: e.target.value }))}
                        placeholder='English translation'
                        size='sm'
                        classNames={{
                          input: 'focus:ring-[#155E75]',
                          inputWrapper: 'focus-within:border-[#155E75]',
                        }}
                      />
                    ) : (
                      <div
                        className='max-w-xs cursor-pointer truncate hover:text-[#155E75]'
                        onClick={() => openDetailModal(locale)}
                      >
                        {locale.en || <span className='italic text-gray-400'>No translation</span>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingKey === locale.key ? (
                      <Input
                        value={editValues.ar || ''}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, ar: e.target.value }))}
                        placeholder='Arabic translation'
                        size='sm'
                        dir='rtl'
                        classNames={{
                          input: 'focus:ring-[#155E75] text-right',
                          inputWrapper: 'focus-within:border-[#155E75]',
                        }}
                      />
                    ) : (
                      <div
                        className='max-w-xs cursor-pointer truncate text-right hover:text-[#155E75]'
                        onClick={() => openDetailModal(locale)}
                        dir='rtl'
                      >
                        {locale.ar || <span className='italic text-gray-400'>لا توجد ترجمة</span>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusChip(locale)}</TableCell>
                  <TableCell>
                    {editingKey === locale.key ? (
                      <div className='flex gap-2'>
                        <Button
                          isIconOnly
                          size='sm'
                          style={{ backgroundColor: '#155E75' }}
                          className='text-white'
                          onPress={() => handleSave(locale.key)}
                          isLoading={updateLocaleMutation.isPending}
                        >
                          <Save className='h-4 w-4' />
                        </Button>
                        <Button isIconOnly size='sm' variant='light' onPress={handleCancel}>
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        onPress={() => handleEdit(locale)}
                        className='hover:bg-[#155E75]/10'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='mt-6 flex justify-center'>
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            showShadow
            classNames={{
              cursor: 'bg-[#155E75] text-white',
            }}
          />
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex items-center gap-2'>
                <Globe className='h-5 w-5' style={{ color: '#155E75' }} />
                Translation Details
              </ModalHeader>
              <ModalBody>
                {selectedLocale && (
                  <div className='space-y-4'>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Translation Key</label>
                      <div className='rounded-lg bg-gray-50 p-3 font-mono text-sm'>{selectedLocale.key}</div>
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>English Translation</label>
                      <div className='min-h-[60px] rounded-lg bg-gray-50 p-3'>
                        {selectedLocale.en || <span className='italic text-gray-400'>No English translation</span>}
                      </div>
                    </div>

                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Arabic Translation</label>
                      <div className='min-h-[60px] rounded-lg bg-gray-50 p-3 text-right' dir='rtl'>
                        {selectedLocale.ar || <span className='italic text-gray-400'>لا توجد ترجمة عربية</span>}
                      </div>
                    </div>

                    <div className='flex items-center justify-between pt-2'>
                      <span className='text-sm text-gray-500'>Status:</span>
                      {getStatusChip(selectedLocale)}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button
                  style={{ backgroundColor: '#155E75' }}
                  className='text-white'
                  onPress={() => {
                    if (selectedLocale) {
                      handleEdit(selectedLocale)
                      onClose()
                    }
                  }}
                >
                  Edit Translation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
