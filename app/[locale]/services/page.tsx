import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Hero } from '@/app/sections/services/Hero/Hero'
import { Process } from '@/app/sections/services/Process/Process'
import { ServicesSection } from '@/app/sections/services/Services/ServicesSection'
import { getTranslation } from '@/lib/i18n-server'

const namespaces = ['services', 'default']

const Services: FC<IPage> = async (props) => {
  const { params } = props
  const { locale } = await params
  const { t } = await getTranslation(locale, namespaces)

  return (
    <div>
      <Hero t={t} />
      <ServicesSection t={t} />
      <Process t={t} />
    </div>
  )
}

export default Services
