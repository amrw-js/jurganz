import { FC } from 'react'

import { initTranslations } from '@/i18n'

import { Hero } from '../sections/home/Hero/Hero'
import { Logos } from '../sections/home/Logos/Logos'
import { Projects } from '../sections/home/Projects/Projects'
import { Services } from '../sections/home/Services/Services'

const namespaces = ['default', 'home']

interface IHome {
  params: Promise<{
    locale: string
  }>
}

const Home: FC<IHome> = async (props) => {
  const { params } = props
  const { locale } = await params

  const { t } = await initTranslations({ locale, namespaces })

  return (
    <div>
      <Hero t={t} />
      <Logos t={t} />
      <Services t={t} />
      <Projects />
    </div>
  )
}

export default Home
