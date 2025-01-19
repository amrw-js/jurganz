import { Divider } from '@nextui-org/react'
import Image from 'next/image'
import { FC, Fragment } from 'react'

import { Section } from '@/app/components/Section/Section'
import { IComponent } from '@/app/global.interface'
import { OUR_PROJECTS } from '@/app/utils/constants'
import ArrowUpIcon from '@/public/images/icons/ArrowUpIcon'
import ClientIcon from '@/public/images/icons/ClientIcon'
import EgyptIcon from '@/public/images/icons/EgyptIcon'
import LineTypeIcon from '@/public/images/icons/LineTypeIcon'
import SpeedIcon from '@/public/images/icons/SpeedIcon'

export const Services: FC<IComponent> = (props) => {
  const { t } = props
  return (
    <Section className='flex flex-col !items-start gap-8 bg-slate-50 lg:gap-10'>
      <div className='flex flex-col gap-2 lg:gap-5'>
        <p className='text-xl font-medium leading-7'>{t('projects_title')}</p>
        <p className='text-4xl font-semibold leading-10'>{t('projects_subtitle')}</p>
      </div>
      <div className='flex w-full flex-col flex-wrap gap-5 lg:gap-10'>
        {OUR_PROJECTS.map(({ imageSrc, i18nTitle, subTitle1, subTitle2, subTitle3 }, index) => (
          <Fragment key={index}>
            <div className='flex flex-col-reverse gap-5 lg:flex-row lg:gap-[60px]'>
              <Image
                src={imageSrc}
                alt='welding'
                width={509}
                height={243}
                className='h-[157px] w-[375px] shrink-0 gap-5 rounded-[20px] object-cover lg:h-[243px] lg:w-[509px]'
              />
              <div className='flex w-full max-w-[335px] lg:max-w-full'>
                <div className='flex flex-col gap-5'>
                  <div className='flex items-center gap-3'>
                    <p className='text-3xl font-semibold leading-9'>{t(i18nTitle)}</p>
                    <EgyptIcon />
                  </div>

                  <div className='flex items-center gap-2'>
                    <ClientIcon />
                    <p className='text-xl font-medium leading-7'>{t(subTitle1)}</p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <LineTypeIcon />
                    <p className='text-xl font-medium leading-7'>{t(subTitle2)}</p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <SpeedIcon />
                    <p className='text-xl font-medium leading-7'>{t(subTitle3)}</p>
                  </div>
                </div>

                <ArrowUpIcon className='ml-auto h-[36px] w-[36px] lg:h-[48px] lg:w-[48px]' />
              </div>
            </div>

            <Divider />
          </Fragment>
        ))}
      </div>
    </Section>
  )
}
