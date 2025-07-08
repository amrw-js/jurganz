import { Divider } from '@heroui/react'
import { FC } from 'react'

import NavigationButton from '@/app/components/NavigationButton/NavigationButton'
import { Section } from '@/app/components/Section/Section'
import { IComponent } from '@/app/global.interface'
import { SERVICES_SECTION } from '@/app/utils/constants'

export const ServicesSection: FC<IComponent> = (props) => {
  const { t } = props

  return (
    <Section className='flex flex-col !items-start gap-2 lg:gap-5'>
      <p className='text-xl font-medium leading-7 lg:leading-none'>{t('services_section_title')}</p>
      <div className='flex w-full flex-wrap gap-8 lg:gap-10'>
        <p className='text-4xl font-semibold leading-10'>{t('services_section_desc')}</p>
        {SERVICES_SECTION.map(({ i18n_heading, i18n_desc }, index) => (
          <div key={i18n_heading} className='flex w-full flex-col gap-10'>
            <div className='flex w-full'>
              <div className='flex flex-col gap-x-[60px] gap-y-3 lg:flex-row'>
                <p className='w-[298px] flex-shrink-0 text-xl font-medium leading-7'>{t(i18n_heading)}</p>
                <p className='max-w-[534px] text-sm font-normal leading-5'>{t(i18n_desc)}</p>
              </div>
              <NavigationButton />
            </div>
            {index !== SERVICES_SECTION.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </Section>
  )
}
