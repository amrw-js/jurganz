'use client'

import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ProductionLine, ProductionLineFormData } from '@/types/production-line.types'

import { ImageUploader } from '../components/ImageUploader'

interface ProductionLineModalProps {
  productionLine?: ProductionLine
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductionLineFormData) => void
}

type FormData = ProductionLineFormData

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

const currencies = [
  { key: 'USD', label: 'USD - US Dollar' },
  { key: 'EUR', label: 'EUR - Euro' },
  { key: 'GBP', label: 'GBP - British Pound' },
  { key: 'JPY', label: 'JPY - Japanese Yen' },
  { key: 'CAD', label: 'CAD - Canadian Dollar' },
  { key: 'AUD', label: 'AUD - Australian Dollar' },
  { key: 'CHF', label: 'CHF - Swiss Franc' },
  { key: 'CNY', label: 'CNY - Chinese Yuan' },
]

export function ProductionLineModal({ productionLine, isOpen, onClose, onSubmit }: ProductionLineModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    defaultValues: {
      companyName: '',
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      productType: '',
      containerType: '',
      capacity: 1,
      yearOfManufacturing: currentYear,
      fillingProcess: '',
      fillingType: '',
      controlPLC: '',
      lineMachines: '',
      approximateWorkingTime: '',
      localCurrency: 'USD',
      price: 0,
      negotiable: false,
      isAvailableNow: true,
      expectedAvailableDate: '',
      published: false,
      photos: [],
    },
    mode: 'onChange',
  })

  const watchIsAvailableNow = watch('isAvailableNow')

  useEffect(() => {
    if (productionLine) {
      reset({
        companyName: productionLine.companyName,
        fullName: productionLine.fullName,
        emailAddress: productionLine.emailAddress,
        phoneNumber: productionLine.phoneNumber,
        productType: productionLine.productType,
        containerType: productionLine.containerType,
        capacity: productionLine.capacity,
        yearOfManufacturing: productionLine.yearOfManufacturing,
        fillingProcess: productionLine.fillingProcess,
        fillingType: productionLine.fillingType,
        controlPLC: productionLine.controlPLC,
        lineMachines: productionLine.lineMachines,
        approximateWorkingTime: productionLine.approximateWorkingTime,
        localCurrency: productionLine.localCurrency,
        price: productionLine.price,
        negotiable: productionLine.negotiable,
        isAvailableNow: productionLine.isAvailableNow,
        expectedAvailableDate: productionLine.expectedAvailableDate || '',
        published: productionLine.published,
        photos: [],
      })
    } else {
      reset({
        companyName: '',
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        productType: '',
        containerType: '',
        capacity: 1,
        yearOfManufacturing: currentYear,
        fillingProcess: '',
        fillingType: '',
        controlPLC: '',
        lineMachines: '',
        approximateWorkingTime: '',
        localCurrency: 'USD',
        price: 0,
        negotiable: false,
        isAvailableNow: true,
        expectedAvailableDate: '',
        published: false,
        photos: [],
      })
    }
  }, [productionLine, isOpen, reset])

  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data)
      handleClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const isEdit = !!productionLine

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement='center'
      backdrop='opaque'
      size='4xl'
      scrollBehavior='inside'
      classNames={{
        backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        base: 'max-h-[95vh]',
        wrapper: 'items-center',
      }}
    >
      <ModalContent className='max-w-5xl'>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-shrink-0 flex-col gap-1 px-6 py-4'>
              <h2 className='text-xl font-semibold'>{isEdit ? 'Edit Production Line' : 'Add New Production Line'}</h2>
              <p className='text-sm font-normal text-default-500'>
                {isEdit
                  ? 'Update your production line details below.'
                  : 'Fill in the details for your production line.'}
              </p>
            </ModalHeader>

            <Divider />

            <form onSubmit={handleSubmit(onFormSubmit)} className='flex h-full min-h-0 flex-col'>
              <ModalBody className='min-h-0 flex-1 overflow-y-auto px-6 py-6'>
                <div className='flex flex-col gap-8'>
                  {/* Personal Information Section */}
                  <div className='space-y-4'>
                    <h3 className='border-b border-default-200 pb-2 text-lg font-semibold text-foreground'>
                      Personal Information
                    </h3>
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
                            isInvalid={!!errors.companyName}
                            errorMessage={errors.companyName?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
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
                            placeholder='Enter your full name'
                            isInvalid={!!errors.fullName}
                            errorMessage={errors.fullName?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
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
                            label='Email Address'
                            placeholder='Enter email address'
                            type='email'
                            isInvalid={!!errors.emailAddress}
                            errorMessage={errors.emailAddress?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
                          />
                        )}
                      />

                      <Controller
                        name='phoneNumber'
                        control={control}
                        rules={{
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[+]?[\d\s\-$$$$]+$/,
                            message: 'Invalid phone number format',
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label='Phone Number'
                            placeholder='Enter phone number'
                            type='tel'
                            isInvalid={!!errors.phoneNumber}
                            errorMessage={errors.phoneNumber?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Production Line Information Section */}
                  <div className='space-y-4'>
                    <h3 className='border-b border-default-200 pb-2 text-lg font-semibold text-foreground'>
                      Production Line Information
                    </h3>
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                      <Controller
                        name='productType'
                        control={control}
                        rules={{ required: 'Product type is required' }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label='Product Type'
                            placeholder='e.g., Beverages, Food, Pharmaceuticals'
                            isInvalid={!!errors.productType}
                            errorMessage={errors.productType?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
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
                            placeholder='e.g., Bottles, Cans, Pouches'
                            isInvalid={!!errors.containerType}
                            errorMessage={errors.containerType?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
                          />
                        )}
                      />

                      <Controller
                        name='capacity'
                        control={control}
                        rules={{
                          required: 'Capacity is required',
                          min: { value: 1, message: 'Capacity must be at least 1' },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label='Capacity (units/hour)'
                            placeholder='Production capacity per hour'
                            type='number'
                            min='1'
                            value={field.value?.toString() || ''}
                            onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                            isInvalid={!!errors.capacity}
                            errorMessage={errors.capacity?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
                          />
                        )}
                      />

                      <Controller
                        name='yearOfManufacturing'
                        control={control}
                        rules={{ required: 'Year of manufacturing is required' }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label='Year of Manufacturing'
                            placeholder='Select year'
                            isInvalid={!!errors.yearOfManufacturing}
                            errorMessage={errors.yearOfManufacturing?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            selectedKeys={field.value ? [field.value.toString()] : []}
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string
                              field.onChange(selectedKey ? Number(selectedKey) : currentYear)
                            }}
                            isRequired
                          >
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year.toString()}
                              </SelectItem>
                            ))}
                          </Select>
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
                            placeholder='e.g., Hot Fill, Cold Fill, Aseptic'
                            isInvalid={!!errors.fillingProcess}
                            errorMessage={errors.fillingProcess?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
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
                            placeholder='e.g., Volumetric, Gravimetric, Level'
                            isInvalid={!!errors.fillingType}
                            errorMessage={errors.fillingType?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
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
                            placeholder='e.g., Siemens, Allen Bradley, Schneider'
                            isInvalid={!!errors.controlPLC}
                            errorMessage={errors.controlPLC?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
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
                            placeholder='e.g., 8 hours/day, 16 hours/day'
                            isInvalid={!!errors.approximateWorkingTime}
                            errorMessage={errors.approximateWorkingTime?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
                          />
                        )}
                      />
                    </div>

                    <Controller
                      name='lineMachines'
                      control={control}
                      rules={{ required: 'Line machines description is required' }}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          label='Line Machines'
                          placeholder='Describe the machines included in the production line...'
                          isInvalid={!!errors.lineMachines}
                          errorMessage={errors.lineMachines?.message}
                          variant='bordered'
                          labelPlacement='outside'
                          minRows={3}
                          isRequired
                        />
                      )}
                    />

                    {/* Pricing Section */}
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                      <Controller
                        name='localCurrency'
                        control={control}
                        rules={{ required: 'Currency is required' }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label='Local Currency'
                            placeholder='Select currency'
                            isInvalid={!!errors.localCurrency}
                            errorMessage={errors.localCurrency?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string
                              field.onChange(selectedKey || 'USD')
                            }}
                            isRequired
                          >
                            {currencies.map((currency) => (
                              <SelectItem key={currency.key} value={currency.key}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />

                      <Controller
                        name='price'
                        control={control}
                        rules={{
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be 0 or greater' },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label='Price'
                            placeholder='Enter price'
                            type='number'
                            min='0'
                            step='0.01'
                            value={field.value?.toString() || ''}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            isInvalid={!!errors.price}
                            errorMessage={errors.price?.message}
                            variant='bordered'
                            labelPlacement='outside'
                            isRequired
                          />
                        )}
                      />

                      <div className='flex items-end'>
                        <Controller
                          name='negotiable'
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              isSelected={field.value}
                              onValueChange={field.onChange}
                              color='primary'
                              className='mt-6'
                            >
                              Price is negotiable
                            </Checkbox>
                          )}
                        />
                      </div>
                    </div>

                    {/* Availability Section */}
                    <div className='space-y-4'>
                      <Controller
                        name='isAvailableNow'
                        control={control}
                        render={({ field }) => (
                          <Checkbox isSelected={field.value} onValueChange={field.onChange} color='primary'>
                            Production line is available now
                          </Checkbox>
                        )}
                      />

                      {!watchIsAvailableNow && (
                        <Controller
                          name='expectedAvailableDate'
                          control={control}
                          rules={{
                            required: !watchIsAvailableNow ? 'Expected available date is required' : false,
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              classNames={{ mainWrapper: 'mt-5' }}
                              label='Expected Available Date'
                              placeholder='When will it be available?'
                              type='date'
                              isInvalid={!!errors.expectedAvailableDate}
                              errorMessage={errors.expectedAvailableDate?.message}
                              variant='bordered'
                              labelPlacement='outside'
                              isRequired={!watchIsAvailableNow}
                            />
                          )}
                        />
                      )}

                      <Controller
                        name='published'
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className='block'
                            isSelected={field.value}
                            onValueChange={field.onChange}
                            color='success'
                          >
                            Publish this production line (make it visible to others)
                          </Checkbox>
                        )}
                      />
                    </div>
                  </div>

                  {/* Media Upload Section */}
                  <div className='space-y-3'>
                    <div className='flex flex-col gap-1'>
                      <label className='text-sm font-medium text-foreground'>Production Line Media</label>
                      <p className='text-xs text-default-500'>
                        Upload up to 20 photos or videos (max 10MB each). Show your production line in action.
                      </p>
                    </div>

                    <Controller
                      name='photos'
                      control={control}
                      rules={{
                        validate: (files) => {
                          if (!files || files.length === 0) return true

                          const invalidFiles = files.filter((file) => {
                            const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
                            const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
                            return !isValidType || !isValidSize
                          })

                          if (invalidFiles.length > 0) {
                            return 'Please upload only image or video files under 10MB'
                          }

                          if (files.length > 20) {
                            return 'Maximum 20 files allowed'
                          }

                          return true
                        },
                      }}
                      render={({ field }) => (
                        <ImageUploader
                          files={field.value || []}
                          onChange={field.onChange}
                          maxFiles={20}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          error={errors.photos?.message}
                          disabled={isSubmitting}
                          acceptVideo={true}
                        />
                      )}
                    />
                  </div>
                </div>
              </ModalBody>

              <Divider />

              <ModalFooter className='flex-shrink-0 px-6 py-4'>
                <Button color='danger' variant='light' onPress={handleClose} isDisabled={isSubmitting}>
                  Cancel
                </Button>
                <Button color='primary' type='submit' isLoading={isSubmitting} isDisabled={!isValid}>
                  {isEdit ? 'Update Production Line' : 'Create Production Line'}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
