import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Providers } from '@/app/providers/Providers'
import { Hero } from '@/app/sections/about/Hero/Hero'
import { initTranslations } from '@/i18n'

const namespaces = ['default', 'about']

const About: FC<IPage> = async (props) => {
  const { params } = props
  const { locale } = await params
  const { t, resources } = await initTranslations({ locale, namespaces })

  return (
    <Providers namespaces={namespaces} locale={locale} resources={resources}>
      <div>
        <Hero t={t} />
      </div>
    </Providers>
  )
}

export default About
