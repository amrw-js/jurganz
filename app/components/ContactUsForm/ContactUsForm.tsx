'use client'

import { Button, Input, Textarea } from '@nextui-org/react'
import { animated, useSpring } from '@react-spring/web'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'

export const ContactUsForm = () => {
  const { t } = useTranslation()

  // Hook to observe when the form is in view
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.25,
  })

  const animationStyles = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 200, friction: 30 },
  })

  return (
    <animated.form
      ref={ref}
      style={animationStyles}
      className='flex flex-1 shrink-0 basis-1/2 flex-col gap-5 rounded-[1.25rem] bg-white px-5 py-8 shadow-md lg:px-10 lg:py-[1.625rem]'
    >
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
    </animated.form>
  )
}
