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
import { useState } from 'react'

import { useLocales, useUpdateLocale } from '@/app/hooks/useLocales'
import type { Locale, UpdateLocale } from '@/types/locales.types'

export default function TranslationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ en?: string; ar?: string }>({})

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null)

  // Fetch locales
  const { data: locales, isLoading, error } = useLocales()
  const updateLocaleMutation = useUpdateLocale()

  // Filter locales based on search
  const filteredLocales =
    locales?.filter(
      (locale) =>
        locale.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        locale.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        locale.ar?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const handleEdit = (locale: Locale) => {
    setEditingKey(locale.key)
    setEditValues({
      en: locale.en || '',
      ar: locale.ar || '',
    })
  }

  const handleSave = async (key: string) => {
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
  }

  const handleCancel = () => {
    setEditingKey(null)
    setEditValues({})
  }

  const openDetailModal = (locale: Locale) => {
    setSelectedLocale(locale)
    onOpen()
  }

  const getStatusChip = (locale: Locale) => {
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
  }

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

      {/* Search and Stats */}
      <Card className='mb-6'>
        <CardBody>
          <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
            <div className='max-w-md flex-1'>
              <Input
                placeholder='Search translations...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className='h-4 w-4 text-gray-400' />}
                classNames={{
                  input: 'focus:ring-[#155E75]',
                  inputWrapper: 'focus-within:border-[#155E75]',
                }}
              />
            </div>
            <div className='flex gap-4 text-sm'>
              <div className='text-center'>
                <div className='font-semibold text-gray-900'>{locales?.length || 0}</div>
                <div className='text-gray-500'>Total Keys</div>
              </div>
              <div className='text-center'>
                <div className='font-semibold' style={{ color: '#155E75' }}>
                  {locales?.filter((l) => l.en && l.ar).length || 0}
                </div>
                <div className='text-gray-500'>Complete</div>
              </div>
              <div className='text-center'>
                <div className='font-semibold text-orange-600'>
                  {locales?.filter((l) => (l.en && !l.ar) || (!l.en && l.ar)).length || 0}
                </div>
                <div className='text-gray-500'>Partial</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Translations Table */}
      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold'>Translation Keys</h2>
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
            <TableBody>
              {filteredLocales.map((locale) => (
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
