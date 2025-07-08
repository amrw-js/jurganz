'use client'

import { useSpring } from '@react-spring/web'
import Image from 'next/image'
import { FC, useCallback, useEffect, useState } from 'react'

import { ScrollableCards } from '@/app/components/ui/ScrollableCards/ScrollableCards'
import { ILogo } from '@/app/global.interface'
import { useTranslations } from '@/app/hooks/useTranslations'
import { LOGOS } from '@/app/utils/constants'

export const Logos: FC = () => {
  const { t } = useTranslations()

  // State to track if the section is in the viewport
  const [inView, setInView] = useState(false)

  // Logo animation (fade in + scale)
  const logoProps = useSpring({
    opacity: inView ? 1 : 0,
    scale: inView ? 1 : 0.8, // Scale animation from 0.8 to 1
    config: { duration: 500 },
  })

  const Transparency = `<span class="text-primary font-bold">${t('transparency')}</span>`
  const Obligation = `<span class="text-primary font-bold">${t('obligation')}</span>`
  const Development = `<span class="text-primary font-bold">${t('development')}</span>`

  const objectiveText = t('objective', {
    Transparency,
    Obligation,
    Development,
    interpolation: { escapeValue: false },
  })

  const renderItem = useCallback(
    ({ src, alt, width, height }: ILogo) => {
      return (
        <div className='flex items-center justify-center'>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className='max-w-40 opacity-40 transition-all hover:opacity-100'
          />
        </div>
      )
    },
    [logoProps],
  )

  // Set up IntersectionObserver to trigger animation when the section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Check if the element is in the viewport
        if (entries[0].isIntersecting) {
          setInView(true)
        } else {
          setInView(false)
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is in view
      },
    )
    const section = document.getElementById('logos-section')
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <div className='mt-10 px-[0.875rem] sm:px-10 lg:mt-[3.375rem]' id='logos-section'>
      {/* Objective text with animation */}
      <p
        className='text-xl font-semibold leading-7 text-gray-400 sm:text-4xl sm:leading-10 lg:w-2/3'
        dangerouslySetInnerHTML={{ __html: objectiveText }}
      />

      {/* Logos container with animation */}
      <div className='mt-5 lg:mt-[3.375rem]'>
        <ScrollableCards
          arrows={false}
          slides={LOGOS}
          autoPlay
          renderItem={renderItem}
          slideClassName='flex-shrink-0 justify-center !pl-0 flex-grow-0 items-center flex basis-[100%] sm:basis-[50%] lg:basis-[25%]'
        />
      </div>
    </div>
  )
}
