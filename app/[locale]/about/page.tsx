import { FC } from 'react'

import { IPage } from '@/app/global.interface'
import { Hero } from '@/app/sections/about/Hero/Hero'
import { Intro } from '@/app/sections/about/Intro/Intro'
import { MissionVision } from '@/app/sections/about/MissionVision/MissionVision'
import { Services } from '@/app/sections/about/Services/Services'
import { Projects } from '@/app/sections/home/Projects/Projects'
import { getTranslation } from '@/lib/i18n-server'

const About: FC<IPage> = async (props) => {
  const { params } = props
  const { locale } = await params
  const { t } = await getTranslation(locale, ['default', 'about'])

  return (
    <div>
      <Hero t={t} />
      <Intro t={t} />
      <MissionVision t={t} />
      <Services t={t} />
      <Projects />
    </div>
  )
}

export default About
