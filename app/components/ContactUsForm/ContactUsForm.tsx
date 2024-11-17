'use client'

import { Button, Input, Textarea } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

export const ContactUsForm = () => {
  const { t } = useTranslation()

  return (
    <form className='flex flex-1 shrink-0 basis-1/2 flex-col gap-5 rounded-[1.25rem] bg-white px-5 py-8 lg:px-10 lg:py-[1.625rem]'>
      <Input
        placeholder={t('contact_form_name')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
      />
      <Input
        placeholder={t('contact_form_email')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
      />
      <Input
        placeholder={t('contact_form_phone')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
      />
      <Input
        placeholder={t('contact_form_company')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
      />
      <Input
        placeholder={t('contact_form_subject')}
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
        variant='bordered'
        className='w-full'
      />
      <Textarea
        placeholder={t('contact_form_message')}
        variant='bordered'
        classNames={{
          inputWrapper: 'rounded-[0.313rem] px-8 py-[1.188rem] h-auto',
        }}
      />
      <Button size='lg' color='primary' className='min-w-40 self-center lg:self-end'>
        {t('send_label')}
      </Button>
    </form>
  )
}
