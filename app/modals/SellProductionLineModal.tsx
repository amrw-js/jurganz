'use client'

import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { CreateProductionLine, ProductionLineFormData, ProductionLineMedia } from '@/types/production-line.types'

import { ImageUploader, MediaItem } from '../components/ImageUploader'

interface ProductionLineModalProps {
  isOpen: boolean
  isPending: boolean
  onClose: () => void
  onSubmit: (data: CreateProductionLine) => void
}

const defaultValues: ProductionLineFormData = {
  // Personal Info
  companyName: '',
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  // Production Line Info
  productType: '',
  containerType: '',
  capacity: '',
  yearOfManufacturing: new Date().getFullYear(),
  fillingProcess: '',
  fillingType: '',
  controlPLC: '',
  lineMachines: '',
  approximateWorkingTime: '',
  localCurrency: '',
  price: 0,
  negotiable: false,
  isAvailableNow: true,
  expectedAvailableDate: '',
  published: false,
  media: [],
}

export default function ProductionLineModal({ isOpen, isPending, onClose, onSubmit }: ProductionLineModalProps) {
  const { t } = useTranslation(['default', 'lines'])

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductionLineFormData>({
    defaultValues,
    mode: 'onBlur',
  })

  const watchIsAvailableNow = watch('isAvailableNow')

  const onSubmitForm = async (data: ProductionLineFormData) => {
    try {
      const submitData: CreateProductionLine = {
        ...data,
        expectedAvailableDate: data.expectedAvailableDate || undefined,
      }

      await onSubmit(submitData)
      reset()
      onClose()
    } catch (error) {
      console.error(t('lines:error_submitting_production_line'), error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='4xl'
      scrollBehavior='inside'
      classNames={{
        base: 'bg-white',
        header: 'border-b border-gray-200',
        footer: 'border-t border-gray-200',
      }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          <h3 className='text-lg font-medium text-gray-900'>{t('lines:submit_production_line_for_sale')}</h3>
        </ModalHeader>
        <ModalBody className='py-6'>
          <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-8'>
            {/* Personal Information */}
            <div>
              <h4 className='text-md mb-4 font-medium text-gray-900'>{t('lines:personal_information')}</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  name='companyName'
                  control={control}
                  rules={{
                    required: t('lines:company_name_required'),
                    minLength: { value: 2, message: t('lines:company_name_min_length') },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:company_name')}
                      placeholder={t('lines:enter_company_name')}
                      isRequired
                      isInvalid={!!errors.companyName}
                      errorMessage={errors.companyName?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='fullName'
                  control={control}
                  rules={{
                    required: t('lines:full_name_required'),
                    minLength: { value: 2, message: t('lines:full_name_min_length') },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:full_name')}
                      placeholder={t('lines:enter_full_name')}
                      isRequired
                      isInvalid={!!errors.fullName}
                      errorMessage={errors.fullName?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='emailAddress'
                  control={control}
                  rules={{
                    required: t('lines:email_address_required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('lines:invalid_email_address'),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='email'
                      label={t('lines:email_address')}
                      placeholder={t('lines:enter_email_address')}
                      isRequired
                      isInvalid={!!errors.emailAddress}
                      errorMessage={errors.emailAddress?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='phoneNumber'
                  control={control}
                  rules={{
                    required: t('lines:phone_number_required'),
                    minLength: { value: 10, message: t('lines:phone_number_min_length') },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='tel'
                      label={t('lines:phone_number')}
                      placeholder={t('lines:enter_phone_number')}
                      isRequired
                      isInvalid={!!errors.phoneNumber}
                      errorMessage={errors.phoneNumber?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* Production Line Information */}
            <div>
              <h4 className='text-md mb-4 font-medium text-gray-900'>{t('lines:production_line_information')}</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  name='productType'
                  control={control}
                  rules={{ required: t('lines:product_type_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:product_type')}
                      placeholder={t('lines:enter_product_type')}
                      isRequired
                      isInvalid={!!errors.productType}
                      errorMessage={errors.productType?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='containerType'
                  control={control}
                  rules={{ required: t('lines:container_type_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:container_type')}
                      placeholder={t('lines:enter_container_type')}
                      isRequired
                      isInvalid={!!errors.containerType}
                      errorMessage={errors.containerType?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='capacity'
                  control={control}
                  rules={{ required: t('lines:capacity_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:capacity')}
                      placeholder={t('lines:enter_capacity')}
                      isRequired
                      isInvalid={!!errors.capacity}
                      errorMessage={errors.capacity?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='yearOfManufacturing'
                  control={control}
                  rules={{
                    required: t('lines:year_of_manufacturing_required'),
                    min: { value: 1900, message: t('lines:year_must_be_after_1900') },
                    max: { value: new Date().getFullYear(), message: t('lines:year_cannot_be_future') },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='number'
                      label={t('lines:year_of_manufacturing')}
                      placeholder={t('lines:enter_year')}
                      isRequired
                      isInvalid={!!errors.yearOfManufacturing}
                      errorMessage={errors.yearOfManufacturing?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                      value={field.value?.toString() || ''}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  )}
                />
                <Controller
                  name='fillingProcess'
                  control={control}
                  rules={{ required: t('lines:filling_process_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:filling_process')}
                      placeholder={t('lines:enter_filling_process')}
                      isRequired
                      isInvalid={!!errors.fillingProcess}
                      errorMessage={errors.fillingProcess?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='fillingType'
                  control={control}
                  rules={{ required: t('lines:filling_type_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:filling_type')}
                      placeholder={t('lines:enter_filling_type')}
                      isRequired
                      isInvalid={!!errors.fillingType}
                      errorMessage={errors.fillingType?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='controlPLC'
                  control={control}
                  rules={{ required: t('lines:control_plc_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:control_plc')}
                      placeholder={t('lines:enter_control_plc')}
                      isRequired
                      isInvalid={!!errors.controlPLC}
                      errorMessage={errors.controlPLC?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='approximateWorkingTime'
                  control={control}
                  rules={{ required: t('lines:approximate_working_time_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:approximate_working_time')}
                      placeholder={t('lines:enter_working_time')}
                      isRequired
                      isInvalid={!!errors.approximateWorkingTime}
                      errorMessage={errors.approximateWorkingTime?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='localCurrency'
                  control={control}
                  rules={{ required: t('lines:local_currency_required') }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={t('lines:local_currency')}
                      placeholder={t('lines:enter_currency_placeholder')}
                      isRequired
                      isInvalid={!!errors.localCurrency}
                      errorMessage={errors.localCurrency?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
                <Controller
                  name='price'
                  control={control}
                  rules={{
                    required: t('lines:price_required'),
                    min: { value: 0, message: t('lines:price_must_be_greater_than_zero') },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='number'
                      step='0.01'
                      label={t('lines:price_usd')}
                      placeholder={t('lines:enter_price_usd')}
                      isRequired
                      isInvalid={!!errors.price}
                      errorMessage={errors.price?.message}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                      value={field.value?.toString() || ''}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </div>

              <div className='mt-4'>
                <Controller
                  name='lineMachines'
                  control={control}
                  rules={{
                    required: t('lines:line_machines_required'),
                    minLength: { value: 10, message: t('lines:description_min_length') },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label={t('lines:line_machines')}
                      placeholder={t('lines:line_machines_placeholder')}
                      isRequired
                      isInvalid={!!errors.lineMachines}
                      errorMessage={errors.lineMachines?.message}
                      minRows={3}
                      classNames={{
                        input: 'focus:ring-[#155E75]',
                        inputWrapper: 'focus-within:border-[#155E75]',
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* Availability and Options */}
            <div>
              <h4 className='text-md mb-4 font-medium text-gray-900'>{t('lines:availability_options')}</h4>
              <div className='space-y-4'>
                <div className='flex flex-wrap gap-6'>
                  <Controller
                    name='negotiable'
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                        classNames={{
                          wrapper: 'before:border-[#155E75] after:bg-[#155E75]',
                        }}
                      >
                        {t('lines:price_is_negotiable')}
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name='isAvailableNow'
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                        classNames={{
                          wrapper: 'before:border-[#155E75] after:bg-[#155E75]',
                        }}
                      >
                        {t('lines:available_now')}
                      </Checkbox>
                    )}
                  />
                </div>

                {!watchIsAvailableNow && (
                  <Controller
                    name='expectedAvailableDate'
                    control={control}
                    rules={{
                      required: !watchIsAvailableNow ? t('lines:expected_available_date_required') : false,
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='date'
                        label={t('lines:expected_available_date')}
                        isRequired
                        isInvalid={!!errors.expectedAvailableDate}
                        errorMessage={errors.expectedAvailableDate?.message}
                        classNames={{
                          input: 'focus:ring-[#155E75]',
                          inputWrapper: 'focus-within:border-[#155E75]',
                        }}
                      />
                    )}
                  />
                )}
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <h4 className='text-md mb-4 font-medium text-gray-900'>{t('lines:media')}</h4>
              <Controller
                name='media'
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    files={field.value as MediaItem[]}
                    onChange={(files) => {
                      // Filter out File objects and keep only ProductionLineMedia
                      const mediaFiles = files.filter(
                        (file): file is ProductionLineMedia => !('lastModified' in file) && 'id' in file,
                      )
                      field.onChange(mediaFiles)
                    }}
                    maxFiles={20}
                    maxFileSize={10 * 1024 * 1024} // 10MB
                    disabled={isSubmitting}
                    acceptVideo={true}
                    onUploadComplete={(uploadedMedia: ProductionLineMedia[]) => {
                      // Add uploaded media to existing media
                      const currentMedia = field.value || []
                      const newMedia = [...currentMedia, ...uploadedMedia]
                      field.onChange(newMedia)
                    }}
                  />
                )}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant='bordered' onPress={handleClose}>
            {t('lines:cancel')}
          </Button>
          <Button
            style={{ backgroundColor: '#155E75' }}
            className='text-white hover:opacity-80'
            onPress={() => handleSubmit(onSubmitForm)()}
            isLoading={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? t('lines:submitting') : t('lines:submit_production_line')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
