'use client'

import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import cn from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'

import '../../../embla.css'

import { usePrevNextButtons } from './usePrevNextButtons'

type ScrollableCardsProps<T> = {
  slides: T[]
  slideClassName?: string
  arrows?: boolean
  renderItem: (item: T, index: number) => JSX.Element
  renderLeftContent?: () => JSX.Element
}

const EMBLA_OPTS = {
  slidesToScroll: 1,
  loop: true,
}

export const ScrollableCards = <T,>(props: ScrollableCardsProps<T>) => {
  const { slides, slideClassName, arrows = true, renderItem, renderLeftContent } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTS)

  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  return (
    <section className='embla'>
      <div className='embla__viewport' ref={emblaRef}>
        <div className='embla__container'>
          {slides.map((item, index) => (
            <div className={cn('embla__slide', slideClassName)} key={index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {arrows && (
        <div className='mt-5 flex items-center justify-between lg:mt-[1.875rem]'>
          {renderLeftContent?.()}
          <div className='flex items-center'>
            <ArrowLeftCircleIcon
              className='size-8 cursor-pointer transition-all hover:text-gray-500 md:size-10'
              onClick={onPrevButtonClick}
            />
            <ArrowRightCircleIcon
              className='size-8 cursor-pointer transition-all hover:text-gray-500 md:size-10'
              onClick={onNextButtonClick}
            />
          </div>
        </div>
      )}
    </section>
  )
}
