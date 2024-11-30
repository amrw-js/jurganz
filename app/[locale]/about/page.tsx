import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Providers } from '@/app/providers/Providers'
import { Hero } from '@/app/sections/about/Hero/Hero'
import { Intro } from '@/app/sections/about/Intro/Intro'
import { MissionVision } from '@/app/sections/about/MissionVision/MissionVision'
import { Services } from '@/app/sections/about/Services/Services'
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
        <Intro t={t} />
        <MissionVision t={t} />
        <Services t={t} />
      </div>
    </Providers>
  )
}

export default About
