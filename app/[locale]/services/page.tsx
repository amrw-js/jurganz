import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Providers } from '@/app/providers/Providers'
import { Hero } from '@/app/sections/services/Hero/Hero'
import { Process } from '@/app/sections/services/Process/Process'
import { ServicesSection } from '@/app/sections/services/Services/ServicesSection'
import { initTranslations } from '@/i18n'

const namespaces = ['default', 'services']

const Services: FC<IPage> = async (props) => {
  const { params } = props
  const { locale } = await params
  const { t, resources } = await initTranslations({ locale, namespaces })

  return (
    <Providers namespaces={namespaces} locale={locale} resources={resources}>
      <div>
        <Hero t={t} />
        <ServicesSection t={t} />
        <Process t={t} />
      </div>
    </Providers>
  )
}

export default Services
