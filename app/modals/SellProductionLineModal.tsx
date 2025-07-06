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
      console.error('Error submitting production line:', error)
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
          <h3 className='text-lg font-medium text-gray-900'>Submit Production Line for Sale</h3>
        </ModalHeader>
        <ModalBody className='py-6'>
          <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-8'>
            {/* Personal Information */}
            <div>
              <h4 className='text-md mb-4 font-medium text-gray-900'>Personal Information</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  name='companyName'
                  control={control}
                  rules={{
                    required: 'Company name is required',
                    minLength: { value: 2, message: 'Company name must be at least 2 characters' },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Company Name'
                      placeholder='Enter company name'
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
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Full name must be at least 2 characters' },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Full Name'
                      placeholder='Enter full name'
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
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='email'
                      label='Email Address'
                      placeholder='Enter email address'
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
                    required: 'Phone number is required',
                    minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='tel'
                      label='Phone Number'
                      placeholder='Enter phone number'
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
              <h4 className='text-md mb-4 font-medium text-gray-900'>Production Line Information</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  name='productType'
                  control={control}
                  rules={{ required: 'Product type is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Product Type'
                      placeholder='Enter product type'
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
                  rules={{ required: 'Container type is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Container Type'
                      placeholder='Enter container type'
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
                  rules={{ required: 'Capacity is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Capacity'
                      placeholder='Enter capacity'
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
                    required: 'Year of manufacturing is required',
                    min: { value: 1900, message: 'Year must be after 1900' },
                    max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='number'
                      label='Year of Manufacturing'
                      placeholder='Enter year'
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
                  rules={{ required: 'Filling process is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Filling Process'
                      placeholder='Enter filling process'
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
                  rules={{ required: 'Filling type is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Filling Type'
                      placeholder='Enter filling type'
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
                  rules={{ required: 'Control PLC is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Control PLC'
                      placeholder='Enter control PLC'
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
                  rules={{ required: 'Approximate working time is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Approximate Working Time'
                      placeholder='Enter working time'
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
                  rules={{ required: 'Local currency is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Local Currency'
                      placeholder='Enter currency (e.g., USD)'
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
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be greater than 0' },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='number'
                      step='0.01'
                      label='Price (USD)'
                      placeholder='Enter price in USD'
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
                    required: 'Line machines description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label='Line Machines'
                      placeholder='Describe the machines included in the production line...'
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
              <h4 className='text-md mb-4 font-medium text-gray-900'>Availability & Options</h4>
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
                        Price is negotiable
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
                        Available now
                      </Checkbox>
                    )}
                  />
                </div>

                {!watchIsAvailableNow && (
                  <Controller
                    name='expectedAvailableDate'
                    control={control}
                    rules={{
                      required: !watchIsAvailableNow
                        ? 'Expected available date is required when not available now'
                        : false,
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='date'
                        label='Expected Available Date'
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
              <h4 className='text-md mb-4 font-medium text-gray-900'>Media</h4>
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
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: '#155E75' }}
            className='text-white hover:opacity-80'
            onPress={() => handleSubmit(onSubmitForm)()}
            isLoading={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? 'Submitting...' : 'Submit Production Line'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
